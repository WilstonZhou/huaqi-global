'use strict';
/*
 * 表单接收端点：/api/contact
 *
 * 背景：站点原先把联系表单拼成 mailto:，微信内置浏览器会拦截 mailto，
 * 移动端没有邮件客户端时也无法提交。这里改为服务端接收，再转发到：
 *   1) 企业微信群机器人 WECOM_WEBHOOK_URL（优先，适合国内移动端）
 *   2) Resend 邮件 RESEND_API_KEY + CONTACT_TO_EMAIL（备选）
 *
 * 环境变量（Vercel Project Settings → Environment Variables）：
 *   WECOM_WEBHOOK_URL   企业微信群机器人 webhook 完整地址
 *   RESEND_API_KEY      Resend API key（可选）
 *   CONTACT_TO_EMAIL    收件邮箱（可选，配合 RESEND_API_KEY）
 *   CONTACT_FROM_EMAIL  发件人（可选，需在 Resend 验证域名）
 *
 * 两个通道都未配置时返回 503，前端会显示“复制内容/企微/电话”兜底，
 * 不会显示假成功。
 */

const MAX_BODY_BYTES = 64 * 1024;
const TYPES = new Set(['contact', 'namecheck', 'linyi']);

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  let body = req.body;
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) return null;
    try {
      body = JSON.parse(body);
    } catch (e) {
      const params = new URLSearchParams(body);
      body = Object.fromEntries(params.entries());
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  return body;
}

function clean(value, max) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, max || 500);
}

function truncateUtf8(text, maxBytes) {
  const buf = Buffer.from(text, 'utf8');
  if (buf.length <= maxBytes) return text;
  return buf.slice(0, maxBytes).toString('utf8').replace(/�$/, '') + '\n…（内容过长，已截断）';
}

function sourceText(payload) {
  const source = payload.source && typeof payload.source === 'object' ? payload.source : {};
  const utm = source.utm && typeof source.utm === 'object' ? source.utm : {};
  const utmText = Object.keys(utm).map((k) => k + '=' + clean(utm[k], 120)).join('&');
  return [
    '页面: ' + clean(source.page, 200),
    '来源页: ' + clean(source.referrer, 300),
    utmText ? 'UTM: ' + utmText : ''
  ].filter(Boolean).join('\n');
}

function buildMessage(type, payload) {
  const lines = ['【新咨询】hq10000.com', '类型: ' + type];

  if (type === 'namecheck') {
    lines.push('公司名称: ' + clean(payload.company, 200));
    lines.push('目标国家: ' + clean(payload.country, 80));
    lines.push('电话/微信: ' + clean(payload.contact, 80));
  } else if (type === 'linyi') {
    lines.push('企业名称: ' + clean(payload.company, 200));
    lines.push('联系人: ' + clean(payload.name, 80));
    lines.push('微信/电话: ' + clean(payload.phone, 80));
    lines.push('主题: ' + clean(payload.subject, 160));
    lines.push('');
    lines.push(truncateUtf8(clean(payload.message, 8000), 1300));
  } else {
    lines.push('姓名: ' + clean(payload.name, 80));
    lines.push('电话: ' + clean(payload.phone, 80));
    lines.push('邮箱: ' + clean(payload.email, 160));
    lines.push('公司: ' + clean(payload.company, 200));
    lines.push('业务: ' + clean(payload.service, 120));
    lines.push('AI 需求: ' + clean(payload.aiNeed, 300));
    lines.push('留言: ' + clean(payload.message, 2000));
  }

  lines.push('');
  lines.push(sourceText(payload));
  return truncateUtf8(lines.filter((line) => line !== undefined).join('\n'), 1900);
}

async function sendWecom(webhook, text) {
  if (!/^https:\/\/qyapi\.weixin\.qq\.com\//.test(webhook)) {
    throw new Error('invalid_wecom_webhook');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msgtype: 'text', text: { content: text } }),
      signal: controller.signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || (result.errcode !== undefined && result.errcode !== 0)) {
      throw new Error('wecom_' + (result.errcode || response.status));
    }
  } finally {
    clearTimeout(timer);
  }
}

async function sendEmail(apiKey, to, text) {
  const from = process.env.CONTACT_FROM_EMAIL || 'hq10000 <noreply@hq10000.com>';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: 'hq10000.com 新咨询',
        text: text
      }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error('resend_' + response.status);
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  const payload = parseBody(req);
  if (!payload) {
    return json(res, 400, { ok: false, error: 'invalid_body' });
  }

  // 简单蜜罐字段：正常用户看不到，机器人常会填。
  if (clean(payload.website, 200)) {
    return json(res, 200, { ok: true });
  }

  const type = TYPES.has(payload.type) ? payload.type : 'contact';
  if (type === 'namecheck') {
    if (!clean(payload.company, 200) || !clean(payload.contact, 80)) {
      return json(res, 400, { ok: false, error: 'missing_fields' });
    }
  } else if (type === 'linyi') {
    if (!clean(payload.company, 200) || !clean(payload.name, 80) || !clean(payload.phone, 80)) {
      return json(res, 400, { ok: false, error: 'missing_fields' });
    }
  } else if (!clean(payload.name, 80) || !clean(payload.phone, 80)) {
    return json(res, 400, { ok: false, error: 'missing_fields' });
  }

  const text = buildMessage(type, payload);

  try {
    const webhook = process.env.WECOM_WEBHOOK_URL;
    if (webhook) {
      await sendWecom(webhook, text);
      return json(res, 200, { ok: true });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    if (resendKey && to) {
      await sendEmail(resendKey, to, text);
      return json(res, 200, { ok: true });
    }

    return json(res, 503, { ok: false, error: 'not_configured' });
  } catch (error) {
    console.error('contact delivery failed:', error && error.message ? error.message : 'unknown');
    return json(res, 502, { ok: false, error: 'delivery_failed' });
  }
};
