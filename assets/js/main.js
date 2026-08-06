/**
 * 华企环球国际咨询 — 全站交互脚本 main.js
 * 依赖: data.js (window.HQ_DATA)
 * 功能: 公共组件渲染、移动端菜单、tab、AI demo、配置器、FAQ、表单、滚动动画
 */
(function () {
  'use strict';
  var D = window.HQ_DATA || {};

  // ============ 工具 ============
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (children) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(function (c) {
        if (c == null) return;
        n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return n;
  }
  function fmtPrice(p) { return '¥' + (p || 0).toLocaleString('zh-CN'); }

  // 统一 SVG 图标:emoji/图标名 -> 内联 SVG(依赖 assets/js/icons.js)
  function iconHtml(iconOrEmoji, cls, size) {
    if (window.HQ_ICON_FROM) return window.HQ_ICON_FROM(iconOrEmoji, cls || '', size || 24);
    return iconOrEmoji;
  }

  // ============ 公共头部 ============
  function renderHeader() {
    var header = $('#site-header');
    // 渐进增强:初始 HTML 已含静态导航时,不再重复渲染
    if (!header || header.querySelector('.nav-menu')) return;
    var c = D.company || {};
    var nav = (D.nav || []).map(function (item) {
      var dropdown = item.dropdown ? '<div class="nav-dropdown">' + item.dropdown.map(function (d) {
        return '<a href="' + relLink(d.link) + '">' + d.name + '</a>';
      }).join('') + '</div>' : '';
      var badge = item.badge ? '<span class="badge-new">' + item.badge + '</span>' : '';
      return '<div class="nav-item"><a class="nav-link" href="' + relLink(item.link) + '">' + item.name + badge + '</a>' + dropdown + '</div>';
    }).join('');
    header.innerHTML =
      '<div class="container">' +
        '<a href="' + relLink('index.html') + '" class="brand">' +
          '<div class="brand-logo">华</div>' +
          '<div class="brand-text">华企环球<small>HUAQI GLOBAL</small></div>' +
        '</a>' +
        '<nav class="nav-menu" id="navMenu">' + nav + '</nav>' +
        '<div class="nav-cta">' +
          '<div class="nav-phone">咨询热线<br><strong>' + (c.phone || '') + '</strong></div>' +
          '<a href="' + relLink('ai-match.html') + '" class="btn btn-gold btn-sm">立即匹配</a>' +
        '</div>' +
        '<button class="nav-toggle" id="navToggle" aria-label="打开菜单" aria-expanded="false" aria-controls="navMenu"><span></span><span></span><span></span></button>' +
      '</div>';
  }

  // 链接相对路径处理(支持子目录页面)
  function relLink(link) {
    if (!link) return '#';
    // 兼容历史 .html 写法,统一输出 cleanUrls 无扩展名链接
    var l = String(link).replace(/\.html$/, '');
    if (l === 'index') l = '/';
    // 检测当前页深度
    var inSub = /\/(services|knowledge|country|solutions|news|cases)\//.test(location.pathname);
    if (inSub && l.indexOf('http') !== 0 && l.indexOf('/') !== 0) {
      return '../' + l;
    }
    return l;
  }

  // ============ 公共页脚 ============
  function renderFooter() {
    var footer = $('#site-footer');
    // 渐进增强:初始 HTML 已含静态页脚时,不再重复渲染
    if (!footer || footer.querySelector('.footer-grid')) return;
    var c = D.company || {};
    var services = (D.services || []).map(function (s) {
      return '<a href="' + relLink(s.link) + '">' + s.name + '</a>';
    }).join('');
    var knowledge = (D.knowledge || []).map(function (k) {
      return '<a href="' + relLink(k.link) + '">' + k.title + '</a>';
    }).join('');
    footer.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a href="' + relLink('index.html') + '" class="brand">' +
              '<div class="brand-logo">华</div>' +
              '<div class="brand-text" style="color:white;">华企环球<small style="color:rgba(255,255,255,0.5);">HUAQI GLOBAL</small></div>' +
            '</a>' +
            '<p>' + (c.fullName || '') + '<br>成立于 ' + (c.foundedYear || '') + ' 年,香港深圳双总部,业务覆盖全球 ' + (c.countriesCovered || '') + ' 个国家及地区。</p>' +
            '<p>📞 ' + (c.phone || '') + '(微信同号)<br>✉️ ' + (c.email || '') + '<br>📍 ' + (c.address || '') + '</p>' +
          '</div>' +
          '<div class="footer-col"><h4>服务范围</h4>' + services + '</div>' +
          '<div class="footer-col"><h4>知识中心</h4>' + knowledge + '</div>' +
          '<div class="footer-col"><h4>关于</h4>' +
            '<a href="' + relLink('about.html') + '">公司简介</a>' +
            '<a href="' + relLink('global-network.html') + '">全球网络</a>' +
            '<a href="' + relLink('ai-match.html') + '">AI 智能匹配</a>' +
            '<a href="' + relLink('delivery-tracking.html') + '">交付追踪</a>' +
            '<a href="' + relLink('contact.html') + '">联系我们</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div>' + (c.copyright || '') + '</div>' +
          '<div class="footer-disclaimer">免责声明:本网站内容仅供参考,各国政策、办理周期与费用以最新官方信息及双方合同约定为准。如需专业意见,请联系我们的顾问团队。</div>' +
        '</div>' +
      '</div>';
  }

  // ============ 漂浮客服 + 移动端底部 CTA 栏 ============
  function renderFloat() {
    if ($('#floatService')) return;
    var c = D.company || {};
    var f = el('div', { class: 'float-service', id: 'floatService' });
    f.innerHTML =
      '<a class="float-btn" href="' + relLink('ai-match.html') + '" title="AI 匹配"><span class="float-icon">' + iconHtml('🤖', '', 20) + '</span><span>AI</span></a>' +
      '<a class="float-btn" href="tel:' + (c.phone || '').replace(/-/g, '') + '" title="电话"><span class="float-icon">' + iconHtml('📞', '', 20) + '</span><span>电话</span></a>' +
      '<a class="float-btn" href="' + relLink('contact.html') + '" title="留言"><span class="float-icon">' + iconHtml('💬', '', 20) + '</span><span>留言</span></a>' +
      '<a class="float-btn float-btn-wechat" href="javascript:void(0)" title="复制微信号" id="floatWechat"><span class="float-icon">' + iconHtml('💬', '', 20) + '</span><span>微信</span></a>';
    document.body.appendChild(f);

    // 微信按钮:展示企业微信二维码弹层(可复制微信号)
    var wechat = $('#floatWechat');
    if (wechat) {
      wechat.addEventListener('click', function (e) {
        e.preventDefault();
        if ($('#wechatPop')) { $('#wechatPop').remove(); return; }
        var wechatNo = (c.wechat || c.phone || '186-1090-2181').replace(/-/g, '');
        var pop = el('div', { class: 'wechat-pop', id: 'wechatPop' });
        pop.innerHTML =
          '<button type="button" class="wechat-pop-close" aria-label="关闭">×</button>' +
          '<div class="wechat-pop-title">企业微信</div>' +
          '<img src="' + relLink('assets/images/wechat-qr.jpg') + '" alt="华企环球企业微信二维码" class="wechat-pop-qr">' +
          '<div class="wechat-pop-tip">打开微信"扫一扫"添加专属顾问</div>' +
          '<div class="wechat-pop-no">微信号:' + wechatNo + '</div>' +
          '<button type="button" class="btn btn-outline btn-sm wechat-pop-copy">复制微信号</button>';
        document.body.appendChild(pop);
        var close = function () { if (pop.parentNode) pop.parentNode.removeChild(pop); };
        $('.wechat-pop-close', pop).addEventListener('click', close);
        pop.addEventListener('click', function (ev) { if (ev.target === pop) close(); });
        document.addEventListener('keydown', function esc(e) {
          if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
        });
        $('.wechat-pop-copy', pop).addEventListener('click', function () {
          var done = function () {
            var tip = el('div', { class: 'float-tip' });
            tip.textContent = '已复制微信号 ' + wechatNo + ',请到微信搜索添加';
            document.body.appendChild(tip);
            setTimeout(function () { tip.remove(); }, 2600);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(wechatNo).then(done, function () { window.prompt('请复制微信号:', wechatNo); });
          } else {
            window.prompt('请复制微信号:', wechatNo);
          }
        });
      });
    }

    // 移动端底部固定 CTA 栏（CSS 仅移动端显示）
    if (!$('#mobileCtaBar')) {
      var bar = el('div', { class: 'mobile-cta-bar', id: 'mobileCtaBar' });
      bar.innerHTML =
        '<a class="btn btn-gold" href="' + relLink('ai-match.html') + '">' + iconHtml('🤖', 'inline-icon', 18) + ' AI 匹配</a>' +
        '<a class="btn btn-primary" href="tel:' + (c.phone || '').replace(/-/g, '') + '">📞 电话咨询</a>';
      document.body.appendChild(bar);
    }
  }

  // ============ 移动端菜单 ============
  function bindNav() {
    var toggle = $('#navToggle');
    var menu = $('#navMenu');
    if (!toggle || !menu) return;

    // 遮罩元素
    var overlay = el('div', { class: 'nav-overlay', id: 'navOverlay' });
    document.body.appendChild(overlay);

    function openMenu() {
      menu.classList.add('show');
      overlay.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('show');
      overlay.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('show')) closeMenu(); else openMenu();
    });
    // 点击遮罩关闭
    overlay.addEventListener('click', closeMenu);
    // 点击菜单内链接后自动关闭
    $all('a', menu).forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // ESC 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('show')) closeMenu();
    });
    // 窗口放大时重置
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // ============ 国家 tab 切换 ============
  function bindCountryTabs() {
    $all('.country-panel').forEach(function (p) { p.setAttribute('aria-hidden', String(!p.classList.contains('active'))); });
    $all('.country-tab').forEach(function (tab) {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', '0');
      tab.setAttribute('aria-selected', String(tab.classList.contains('active')));
      tab.addEventListener('click', function () {
        var group = tab.getAttribute('data-group');
        var target = tab.getAttribute('data-target');
        $all('.country-tab[data-group="' + group + '"]').forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        $all('.country-panel[data-group="' + group + '"]').forEach(function (p) { p.classList.remove('active'); p.setAttribute('aria-hidden', 'true'); });
        var panel = $('[data-panel="' + target + '"]');
        if (panel) { panel.classList.add('active'); panel.setAttribute('aria-hidden', 'false'); }
      });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); }
      });
    });
  }

  // ============ AI 对话 demo(规则匹配引擎) ============
  function bindAIDemo() {
    var demo = $('#aiDemo');
    if (!demo) return;
    var body = $('.ai-body', demo);
    var inputWrap = $('.ai-input', demo);
    var input = $('.ai-input input', demo);
    var dialog = (D.aiMatch && D.aiMatch.sampleDialog) || [];
    var idx = 0;

    function appendMsg(role, text) {
      var m = el('div', { class: 'ai-msg ' + role });
      m.innerHTML = '<pre>' + escapeHTML(text) + '</pre>';
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    }
    function typing() {
      var t = el('div', { class: 'ai-typing' });
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      return t;
    }
    function escapeHTML(s) {
      return String(s).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    }

    // ---- 规则匹配引擎:识别国家 + 服务 + 场景 ----
    var COUNTRY_MAP = {
      '新加坡': 'SG', 'singapore': 'SG', '狮城': 'SG',
      '美国': 'US', '美帝': 'US', ' us': 'US', 'usa': 'US', 'united states': 'US',
      '马来西亚': 'MY', '马来': 'MY', 'malaysia': 'MY',
      '泰国': 'TH', 'thai': 'TH', 'thailand': 'TH',
      '印尼': 'ID', '印度尼西亚': 'ID', 'indonesia': 'ID',
      '香港': 'HK', 'hongkong': 'HK', 'hong kong': 'HK',
      '开曼': 'CAY', 'cayman': 'CAY', 'bvi': 'CAY', '英属维尔京': 'CAY',
      '英国': 'UK', '德国': 'DE', '法国': 'FR', '荷兰': 'NL',
      '日本': 'JP', '韩国': 'KR', '越南': 'VN', '菲律宾': 'PH',
      '阿联酋': 'AE', '迪拜': 'AE', '沙特': 'SA'
    };
    var SERVICE_MAP = {
      '注册': 'company-registration', '设立': 'company-registration', '开公司': 'company-registration', '成立公司': 'company-registration',
      '开户': 'bank-account', '银行': 'bank-account', '账户': 'bank-account', '开户行': 'bank-account',
      '年审': 'annual-review', '年报': 'annual-review', '续期': 'annual-review',
      '审计': 'audit', '报表': 'audit',
      '注销': 'company-deregistration', '转让': 'company-deregistration', '解散': 'company-deregistration', '关闭公司': 'company-deregistration',
      'vat': 'tax-planning', '税': 'tax-planning', '税务': 'tax-planning', 'odi': 'tax-planning', '备案': 'tax-planning', 'epr': 'tax-planning', '消费税': 'tax-planning',
      'vie': 'fund-planning', '架构': 'fund-planning', '红筹': 'fund-planning', '资金': 'fund-planning', '离岸': 'fund-planning', '信托': 'fund-planning',
      '商标': 'other-services', '专利': 'other-services', '公证': 'other-services', '海牙': 'other-services', '认证': 'other-services', 'apostille': 'other-services'
    };
    var SCENARIO_MAP = {
      '跨境': '跨境电商出海', '亚马逊': '跨境电商出海', 'shopify': '跨境电商出海', '独立站': '跨境电商出海', 'ebay': '跨境电商出海',
      '上市': 'VIE 红筹架构', '融资': 'VIE 红筹架构', 'ipo': 'VIE 红筹架构',
      '移民': '海外身份规划', '身份': '海外身份规划', '签证': '海外身份规划', '绿卡': '海外身份规划',
      '建厂': '海外建厂落地', '工厂': '海外建厂落地', '制造': '海外建厂落地'
    };

    function matchRule(userText) {
      var t = (' ' + userText.toLowerCase() + ' ');
      var services = D.services || [];
      var matchedCountry = null;
      var matchedServices = [];
      var scenario = null;

      for (var k in COUNTRY_MAP) {
        if (t.indexOf(k) > -1) { matchedCountry = COUNTRY_MAP[k]; break; }
      }
      for (var k2 in SERVICE_MAP) {
        if (t.indexOf(k2) > -1) {
          var svc = services.filter(function (s) { return s.id === SERVICE_MAP[k2]; })[0];
          if (svc && matchedServices.indexOf(svc) === -1) matchedServices.push(svc);
        }
      }
      for (var k3 in SCENARIO_MAP) {
        if (t.indexOf(k3) > -1) { scenario = SCENARIO_MAP[k3]; break; }
      }
      // 无明确服务但有场景:推荐组合
      if (!matchedServices.length && scenario) {
        if (scenario === '跨境电商出海') {
          matchedServices = [
            services.filter(function (s) { return s.id === 'company-registration'; })[0],
            services.filter(function (s) { return s.id === 'bank-account'; })[0],
            services.filter(function (s) { return s.id === 'tax-planning'; })[0]
          ].filter(Boolean);
        } else if (scenario === 'VIE 红筹架构') {
          matchedServices = [
            services.filter(function (s) { return s.id === 'fund-planning'; })[0],
            services.filter(function (s) { return s.id === 'tax-planning'; })[0]
          ].filter(Boolean);
        } else if (scenario === '海外建厂落地') {
          matchedServices = [
            services.filter(function (s) { return s.id === 'company-registration'; })[0],
            services.filter(function (s) { return s.id === 'audit'; })[0]
          ].filter(Boolean);
        }
      }
      return { country: matchedCountry, services: matchedServices, scenario: scenario, raw: userText };
    }

    function generateReply(match) {
      var phone = (D.company && D.company.phone) || '';
      if (!match.services.length && !match.scenario) {
        return '感谢您的咨询!您的需求我需要更多信息来精准推荐。\n\n请补充:\n1) 目标国家(如新加坡/美国/泰国)\n2) 业务类型(如注册/开户/审计/VIE架构)\n\n或直接拨打 ' + phone + ' 由资深顾问为您服务。';
      }
      var reply = '基于您的需求,我为您生成以下方案:\n\n';
      if (match.scenario) reply += '🎯 识别场景:' + match.scenario + '\n';
      if (match.country) {
        var cname = { SG: '新加坡', US: '美国', MY: '马来西亚', TH: '泰国', ID: '印尼', HK: '香港', CAY: '开曼/BVI', UK: '英国', JP: '日本' }[match.country] || match.country;
        reply += '🌍 目标国家:' + cname + '\n';
      }
      reply += '\n';
      match.services.forEach(function (s, i) {
        var country = s.countries.filter(function (c) { return c.code === match.country; })[0];
        var timeline, entity;
        if (country) {
          timeline = country.timeline; entity = country.entity;
        } else {
          var min = s.countries[0];
          s.countries.forEach(function (c) { if (c.priceFrom < min.priceFrom) min = c; });
          timeline = min.timeline; entity = min.entity;
        }
        reply += (i + 1) + ') ' + s.icon + ' ' + s.name + (country ? '(' + country.name + ' ' + entity + ')' : '') + '\n';
        reply += '   周期 ' + timeline + ' | 费用:定制报价\n\n';
      });
      reply += '━━━━━━━━━━━━━━\n';
      reply += '⏱️ 综合周期:约 2-6 周(视服务组合)\n';
      reply += '💰 费用:顾问将根据需求精准报价,承诺无隐形消费\n\n';
      reply += '下一步:\n• 继续提问可细化方案(如"加银行开户")\n• 拨打 ' + phone + ' 转 5 年+ 资深顾问获取报价\n• 或填写联系表单,顾问 30 秒内响应';
      return reply;
    }

    function send() {
      var val = (input && input.value || '').trim();
      if (!val) return;
      appendMsg('user', val);
      input.value = '';
      var t = typing();
      setTimeout(function () {
        t.remove();
        var match = matchRule(val);
        appendMsg('ai', generateReply(match));
      }, 700 + Math.random() * 500);
    }

    // 自动播放预设对话
    function playNext() {
      if (idx >= dialog.length) return;
      var item = dialog[idx++];
      if (item.role === 'ai') {
        var t = typing();
        setTimeout(function () {
          t.remove();
          appendMsg('ai', item.text);
          setTimeout(playNext, 700);
        }, 900);
      } else {
        setTimeout(function () {
          appendMsg('user', item.text);
          setTimeout(playNext, 600);
        }, 300);
      }
    }
    playNext();

    // 加发送按钮(若尚未添加)
    if (inputWrap && !$('button', inputWrap) && input) {
      var sendBtn = el('button', { class: 'btn btn-primary btn-sm', type: 'button', text: '发送' });
      inputWrap.appendChild(sendBtn);
      sendBtn.addEventListener('click', send);
    }

    // 快捷问句:点击即发送
    $all('.ai-suggestion', demo).forEach(function (s) {
      s.addEventListener('click', function () {
        if (input) { input.value = s.textContent; send(); }
      });
    });
    // 回车发送
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); send(); }
      });
    }
  }

  // ============ 方案配置器 ============
  function bindConfigurator() {
    var config = $('#configurator');
    if (!config) return;
    var totalEl = $('.config-total .total-num', config);
    var items = $all('.config-item', config);
    function update() {
      var total = 0;
      items.forEach(function (it) {
        var cb = $('input[type=checkbox]', it);
        var price = parseInt(it.getAttribute('data-price') || '0', 10);
        if (cb && cb.checked) total += price;
      });
      if (totalEl) totalEl.textContent = fmtPrice(total);
    }
    items.forEach(function (it) {
      var cb = $('input[type=checkbox]', it);
      if (cb) cb.addEventListener('change', update);
    });
    update();
  }

  // ============ FAQ 折叠 ============
  function bindFAQ() {
    $all('.faq-item').forEach(function (item) {
      var q = $('.faq-q', item);
      if (!q) return;
      function toggle() {
        var open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(open));
      }
      q.addEventListener('click', toggle);
      q.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  // ============ 联系表单 ============
  function bindContactForm() {
    var form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (D.company && D.company.email) || '';
      var success = $('#formSuccess', form);
      var d = new FormData(form);
      function val(k) { var v = d.get(k); return v ? String(v).trim() : ''; }
      var lines = [
        '姓名: ' + val('name'),
        '电话: ' + val('phone'),
        '邮箱: ' + val('email'),
        '公司名称: ' + val('company'),
        '咨询业务: ' + val('service'),
        'AI 匹配需求: ' + val('aiNeed'),
        '留言: ' + val('message')
      ];
      var subject = encodeURIComponent('网站咨询-' + (val('service') || '综合需求') + '-' + (val('name') || '未留名'));
      var body = encodeURIComponent(lines.join('\n'));
      form.reset();
      if (email) {
        // 静态站无后端:调起用户邮件客户端发送,邮件内容即表单字段
        window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
      }
      if (success) {
        success.classList.add('show');
        setTimeout(function () { success.classList.remove('show'); }, 8000);
      }
    });
  }

  // ============ 免费核名/查重意向表单(留资钩子) ============
  function bindNameCheck() {
    var form = $('#nameCheckForm');
    if (!form) return;
    var success = $('#nameCheckSuccess');
    var btn = $('#nameCheckBtn');
    var submit = function (e) {
      e.preventDefault();
      var company = $('#ncCompany').value.trim();
      var country = $('#ncCountry').value;
      var contact = $('#ncContact').value.trim();
      if (!company) { alert('请填写拟注册的公司名称'); return; }
      if (!contact) { alert('请留下您的电话或微信,顾问才能反馈查重结果'); return; }
      var subject = encodeURIComponent('免费核名申请-' + country + '-' + company);
      var body = encodeURIComponent(
        '公司名称:' + company + '\n' +
        '目标国家:' + country + '\n' +
        '联系电话/微信:' + contact + '\n\n' +
        '请顾问协助查询名称是否可用并反馈注册建议,谢谢。'
      );
      window.location.href = 'mailto:' + (D.company && D.company.email ? D.company.email : 'contact@hq10000.com') +
        '?subject=' + subject + '&body=' + body;
      if (success) {
        success.style.display = 'block';
        btn && btn.setAttribute('disabled', 'disabled');
      }
    };
    form.addEventListener('submit', submit);
    var trigger = $('#nameCheckGo');
    if (trigger) {
      trigger.addEventListener('click', function () {
        var target = $('#nameCheckSection');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // ============ 滚动淡入 ============
  function bindScrollAnim() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in-view');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    $all('.feature-card, .service-card, .knowledge-card, .case-card, .region-card, .value-card').forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // ============ 当前导航高亮 ============
  function highlightNav() {
    var path = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
    $all('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var last = (href.split('/').pop() || 'index').replace(/\.html$/, '');
      if (last === path) link.parentElement.classList.add('active');
    });
  }

  // ============ 数据驱动的渲染入口 ============
  function renderDataDriven() {
    // 首页 4 大功能
    var featHost = $('#featuresGrid');
    if (featHost && D.features) {
      featHost.innerHTML = D.features.map(function (f) {
        return '<div class="feature-card' + (f.highlight ? ' highlight' : '') + '">' +
          '<div class="feature-icon">' + iconHtml(f.icon, '', 26) + '</div>' +
          '<div class="feature-title">' + f.title + '</div>' +
          '<div class="feature-tagline">' + f.tagline + '</div>' +
          '<div class="feature-desc">' + f.desc + '</div>' +
          '<a class="feature-link" href="' + relLink(f.link) + '">了解详情</a>' +
        '</div>';
      }).join('');
    }

    // 6 大服务亮点(融合新资料)
    var hlHost = $('#highlightsGrid');
    if (hlHost && D.highlights) {
      hlHost.innerHTML = D.highlights.map(function (h) {
        return '<div class="feature-card">' +
          '<div class="feature-icon">' + iconHtml(h.icon, '', 26) + '</div>' +
          '<div class="feature-title">' + h.title + '</div>' +
          '<div class="feature-desc" style="margin-top:10px;">' + h.desc + '</div>' +
        '</div>';
      }).join('');
    }

    // 首页 8 大服务
    var svcHost = $('#servicesGrid');
    if (svcHost && D.services) {
      svcHost.innerHTML = D.services.map(function (s) {
        return '<a class="service-card" href="' + relLink(s.link) + '">' +
          '<div class="service-icon">' + iconHtml(s.icon, '', 26) + '</div>' +
          '<div class="service-name">' + s.name + '</div>' +
          '<div class="service-tagline">' + s.tagline + '</div>' +
          '<div class="service-desc">' + s.desc + '</div>' +
          '<div class="service-meta">' +
            '<div class="service-price">定制方案<br><strong>咨询报价</strong></div>' +
            '<span class="service-link">查看详情 →</span>' +
          '</div>' +
        '</a>';
      }).join('');
    }

    // 首页 stats
    var statsHost = $('#heroStats');
    if (statsHost && D.stats) {
      statsHost.innerHTML = D.stats.map(function (s) {
        return '<div class="hero-stat"><div class="num">' + s.value + '</div><div class="label">' + s.label + ' ' + s.unit + '</div></div>';
      }).join('');
    }

    // 首页 hero AI 卡片
    var heroCard = $('#heroAICard');
    if (heroCard && D.aiMatch && D.aiMatch.sampleDialog) {
      var d = D.aiMatch.sampleDialog;
      heroCard.innerHTML =
        '<h3>' + iconHtml('🤖', '', 20) + ' AI 企服顾问实时演示</h3>' +
        (d[0] ? '<div class="ai-bubble">' + d[0].text + '</div>' : '') +
        (d[1] ? '<div class="ai-bubble user">' + d[1].text + '</div>' : '') +
        (d[2] ? '<div class="ai-bubble">' + d[2].text + '</div>' : '') +
        '<div class="hero-card-cta">' +
          '<a href="' + relLink('ai-match.html') + '" class="btn btn-primary btn-sm">立即体验</a>' +
          '<a href="' + relLink('contact.html') + '" class="btn btn-outline btn-sm">转人工</a>' +
        '</div>';
    }

    // 首页知识中心
    var kbHost = $('#knowledgeGrid');
    if (kbHost && D.knowledge) {
      kbHost.innerHTML = D.knowledge.map(function (k) {
        return '<a class="knowledge-card" href="' + relLink(k.link) + '">' +
          '<div class="knowledge-cover">' + iconHtml('📄', '', 46) + '</div>' +
          '<div class="knowledge-body">' +
            '<span class="knowledge-tag">' + k.category + ' · ' + k.tag + '</span>' +
            '<div class="knowledge-title">' + k.title + '</div>' +
            '<div class="knowledge-excerpt">' + k.excerpt + '</div>' +
            '<div class="knowledge-meta"><span>' + k.publishDate + '</span><span>' + k.readTime + '</span></div>' +
          '</div>' +
        '</a>';
      }).join('');
    }

    // 首页 FAQ
    var faqHost = $('#faqList');
    if (faqHost && D.faq) {
      faqHost.innerHTML = D.faq.map(function (f) {
        return '<div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">' + f.q + '</div><div class="faq-a"><p>' + f.a + '</p></div></div>';
      }).join('');
    }

    // 首页客户案例
    var caseHost = $('#casesGrid');
    if (caseHost && D.cases) {
      caseHost.innerHTML = D.cases.map(function (c) {
        return '<div class="case-card">' +
          '<span class="case-industry">' + c.industry + '</span>' +
          '<div class="case-title">' + c.title + '</div>' +
          '<div class="case-desc">' + c.desc + '</div>' +
          '<div class="case-tags">' + c.tags.map(function (t) { return '<span class="case-tag">' + t + '</span>'; }).join('') + '</div>' +
        '</div>';
      }).join('');
    }

    // 全球网络页面
    var regionHost = $('#regionGrid');
    if (regionHost && D.globalNetwork) {
      regionHost.innerHTML = D.globalNetwork.regions.map(function (r) {
        return '<div class="region-card"><h3>' + r.region + '</h3><div class="country-tags">' +
          r.countries.map(function (c) { return '<span class="country-tag">' + c + '</span>'; }).join('') +
        '</div></div>';
      }).join('');
    }
    var officeHost = $('#officeGrid');
    if (officeHost && D.company) {
      officeHost.innerHTML = D.company.domesticBranches.map(function (city) {
        return '<div class="office-card"><div class="office-city">' + city + '</div><div class="office-type">国内分公司</div></div>';
      }).join('');
      // 加上双总部
      var hq = '<div class="office-card" style="border-color:var(--c-gold);"><div class="office-city">香港</div><div class="office-type">双总部</div></div>' +
               '<div class="office-card" style="border-color:var(--c-gold);"><div class="office-city">深圳</div><div class="office-type">双总部</div></div>';
      officeHost.innerHTML = hq + officeHost.innerHTML;
    }

    // 全球海外分支机构(融合品牌资料)
    var overseasHost = $('#overseasOfficesGrid');
    if (overseasHost && D.overseasOffices) {
      overseasHost.innerHTML = D.overseasOffices.map(function (o) {
        return '<div class="info-card" style="padding:24px;text-align:left;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
            '<div style="font-size:28px;">' + o.flag + '</div>' +
            '<span style="font-size:12px;padding:4px 10px;background:linear-gradient(135deg,var(--c-primary) 0%,var(--c-primary-light) 100%);color:white;border-radius:20px;">' + o.note + '</span>' +
          '</div>' +
          '<div style="font-size:18px;font-weight:700;color:var(--c-primary);margin-bottom:6px;">' + o.city + ' · ' + o.country + '</div>' +
          '<div style="font-size:13px;color:var(--c-text-light);line-height:1.7;">' + o.address + '</div>' +
        '</div>';
      }).join('');
    }

    // ============ 新增模块 ============

    // 4 大出海服务类型
    var typesHost = $('#serviceTypesGrid');
    if (typesHost && D.serviceTypes) {
      typesHost.innerHTML = D.serviceTypes.map(function (t) {
        return '<div class="info-card" style="padding:24px;text-align:left;">' +
          '<div class="type-icon">' + iconHtml(t.icon, '', 34) + '</div>' +
          '<h3 style="font-size:18px;color:var(--c-primary);margin:0 0 16px 0;">' + t.name + '</h3>' +
          '<div style="display:flex;flex-direction:column;gap:10px;">' +
            t.items.map(function (it) { return '<div style="display:flex;align-items:flex-start;gap:8px;font-size:14px;color:var(--c-text-light);"><span style="color:var(--c-gold);">✓</span>' + it + '</div>'; }).join('') +
          '</div>' +
        '</div>';
      }).join('');
    }

    // 4 大合规体系 × 3子要点
    var compHost = $('#complianceSystemsGrid');
    if (compHost && D.complianceSystems) {
      compHost.innerHTML = D.complianceSystems.map(function (c) {
        return '<div class="info-card" style="padding:24px;text-align:left;">' +
          '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
            '<div class="comp-icon">' + iconHtml(c.icon, '', 30) + '</div>' +
            '<h3 style="font-size:20px;color:var(--c-primary);margin:0;">' + c.category + '</h3>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:14px;">' +
            c.points.map(function (p) {
              return '<div style="background:var(--c-bg-soft);padding:14px;border-radius:var(--radius-md);border-left:3px solid var(--c-gold);">' +
                '<div style="font-size:15px;font-weight:600;color:var(--c-text);margin-bottom:6px;">' + iconHtml('📌', 'inline-icon', 14) + ' ' + p.title + '</div>' +
                '<div style="font-size:13px;color:var(--c-text-light);line-height:1.7;">' + p.desc + '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>';
      }).join('');
    }

    // 6 步服务流程
    var processHost = $('#serviceProcessGrid');
    if (processHost && D.serviceProcess) {
      processHost.innerHTML = D.serviceProcess.map(function (s, i) {
        var isLast = i === D.serviceProcess.length - 1;
        return '<div class="feature-card" style="position:relative;padding:20px;">' +
          (isLast ? '' : '<div style="position:absolute;top:50%;right:-12px;width:24px;height:2px;background:var(--c-primary-light);display:none;" class="process-line"></div>') +
          '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
            '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--c-primary) 0%,var(--c-primary-light) 100%);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;">' + s.step + '</div>' +
            '<div class="process-icon">' + iconHtml(s.icon, '', 26) + '</div>' +
          '</div>' +
          '<h3 style="font-size:16px;color:var(--c-primary);margin:0 0 8px 0;">' + s.title + '</h3>' +
          '<div style="font-size:13px;color:var(--c-text-light);line-height:1.7;">' + s.desc + '</div>' +
        '</div>';
      }).join('');
    }

    // 全球国家覆盖详细分布
    var countriesMapHost = $('#globalCountriesGrid');
    if (countriesMapHost && D.globalCountriesByRegion) {
      countriesMapHost.innerHTML = D.globalCountriesByRegion.map(function (r) {
        return '<div class="info-card" style="padding:24px;text-align:left;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
            '<h3 style="font-size:18px;color:var(--c-primary);margin:0;">' + r.region + '</h3>' +
            '<span style="font-size:12px;padding:4px 12px;background:var(--c-bg-soft);color:var(--c-primary);border-radius:20px;font-weight:600;">' + r.countries.length + ' 国</span>' +
          '</div>' +
          '<div class="country-tags">' +
            r.countries.map(function (c) { return '<span class="country-tag">' + c + '</span>'; }).join('') +
          '</div>' +
        '</div>';
      }).join('');
    }

    // VAT 注册(13国)
    var vatHost = $('#vatGrid');
    if (vatHost && D.vatEprCertification && D.vatEprCertification.vat) {
      vatHost.innerHTML = D.vatEprCertification.vat.map(function (v) {
        return '<div class="info-card" style="padding:20px;text-align:left;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
            '<div style="font-size:24px;">' + v.country + '</div>' +
            '<span style="font-size:12px;padding:4px 10px;background:var(--c-accent-soft);color:var(--c-accent);border-radius:20px;">' + v.timeline + '</span>' +
          '</div>' +
          '<div style="font-size:15px;font-weight:600;color:var(--c-text);margin-bottom:8px;">' + v.name + '</div>' +
          '<div style="font-size:13px;color:var(--c-primary);font-weight:600;">咨询报价</div>' +
        '</div>';
      }).join('');
    }

    // EPR 合规(包装法/电池法/WEEE/欧代英代等)
    var eprHost = $('#eprGrid');
    if (eprHost && D.vatEprCertification && D.vatEprCertification.epr) {
      eprHost.innerHTML = D.vatEprCertification.epr.map(function (e) {
        return '<div class="info-card" style="padding:16px;text-align:left;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
            '<span style="font-size:20px;">' + e.country + '</span>' +
            '<span style="font-size:12px;padding:2px 8px;background:var(--c-bg-soft);color:var(--c-primary);border-radius:12px;">' + e.area + '</span>' +
          '</div>' +
          '<div style="font-size:14px;font-weight:600;color:var(--c-text);margin-bottom:6px;">' + e.category + '</div>' +
          '<div style="font-size:12px;color:var(--c-primary);font-weight:600;">咨询报价</div>' +
        '</div>';
      }).join('');
    }

    // 产品认证(CE/FDA/FCC/ROHS/CPC等)
    var certHost = $('#certificationGrid');
    if (certHost && D.vatEprCertification && D.vatEprCertification.certification) {
      certHost.innerHTML = D.vatEprCertification.certification.map(function (c) {
        return '<div class="info-card" style="padding:20px;text-align:left;">' +
          '<div style="font-size:16px;font-weight:700;color:var(--c-primary);margin-bottom:8px;">✅ ' + c.name + '</div>' +
          '<div style="font-size:13px;color:var(--c-text-light);margin-bottom:10px;">' + c.scope + '</div>' +
          '<div style="font-size:13px;color:var(--c-gold);font-weight:600;">咨询报价</div>' +
        '</div>';
      }).join('');
    }

    // 商标版权(22国商标+4国版权)
    var tmHost = $('#trademarkGrid');
    if (tmHost && D.vatEprCertification && D.vatEprCertification.trademarkCopyright) {
      tmHost.innerHTML = D.vatEprCertification.trademarkCopyright.map(function (t) {
        return '<div class="info-card" style="padding:14px;text-align:left;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
            '<span style="font-size:18px;">' + t.country + '</span>' +
            '<span style="font-size:11px;padding:1px 6px;background:var(--c-gold-soft);color:var(--c-gold-deep);border-radius:10px;">' + t.type + '</span>' +
          '</div>' +
          '<div style="font-size:13px;font-weight:500;color:var(--c-text);margin-bottom:4px;">' + t.area + ' ' + t.type + '</div>' +
          '<div style="font-size:11px;color:var(--c-primary);font-weight:600;">咨询报价</div>' +
        '</div>';
      }).join('');
    }

    // 交付追踪页时间线
    var trackHost = $('#trackingTimeline');
    if (trackHost && D.deliveryFlow) {
      trackHost.innerHTML = D.deliveryFlow.steps.map(function (s) {
        return '<div class="tracking-step ' + s.status + '">' +
          '<div class="tracking-dot">' + s.step + '</div>' +
          '<div class="tracking-content">' +
            '<div class="tracking-step-name">' + s.name + ' <span class="tracking-step-status status-' + s.status + '">' +
              (s.status === 'done' ? '✓ 已完成' : s.status === 'current' ? '● 进行中' : '○ 待办理') + '</span></div>' +
            '<div class="tracking-step-meta">预计耗时:' + s.duration + '</div>' +
            '<div class="tracking-step-desc">' + s.desc + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // 相关推荐模块(SEO内链策略)
    var relatedHost = $('#relatedServicesGrid');
    if (relatedHost && D.relatedServices) {
      var currentPath = window.location.pathname;
      // 规范化路径:去除开头的斜杠
      var normalizedPath = currentPath.replace(/^\//, '');
      // 尝试精确匹配,如果没有则使用 default
      var related = D.relatedServices[normalizedPath] ||
        D.relatedServices[normalizedPath.replace(/\.html$/, '')] ||
        D.relatedServices[normalizedPath + '.html'] ||
        D.relatedServices['default'];
      if (related) {
        relatedHost.innerHTML = related.map(function (r) {
          return '<a href="' + r.url + '" class="info-card" style="padding:24px;text-decoration:none;color:inherit;transition:transform 0.2s,box-shadow 0.2s;display:block;" onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 8px 24px rgba(0,0,0,0.08)\'" onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'none\'">' +
            '<div style="font-size:36px;margin-bottom:12px;">' + r.icon + '</div>' +
            '<h3 style="font-size:18px;color:var(--c-primary);margin:0 0 12px 0;">' + r.title + '</h3>' +
            '<p style="font-size:14px;color:var(--c-text-light);margin:0;line-height:1.6;">' + r.desc + '</p>' +
            '<div style="margin-top:16px;font-size:13px;color:var(--c-gold);font-weight:600;">查看详情 →</div>' +
          '</a>';
        }).join('');
      }
    }

    // 相关文章模块(知识中心内容集群)
    var articleHost = $('#relatedArticlesGrid');
    if (articleHost && D.relatedArticles) {
      var currentPath2 = window.location.pathname;
      var normalizedPath2 = currentPath2.replace(/^\//, '');
      var articles = D.relatedArticles[normalizedPath2] ||
        D.relatedArticles[normalizedPath2.replace(/\.html$/, '')] ||
        D.relatedArticles[normalizedPath2 + '.html'] ||
        D.relatedArticles['default'];
      if (articles) {
        articleHost.innerHTML = articles.map(function (r) {
          return '<a href="' + r.url + '" class="info-card" style="padding:24px;text-decoration:none;color:inherit;transition:transform 0.2s,box-shadow 0.2s;display:block;" onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 8px 24px rgba(0,0,0,0.08)\'" onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'none\'">' +
            '<div style="font-size:18px;color:var(--c-primary);margin:0 0 12px 0;font-weight:600;">' + r.title + '</div>' +
            '<p style="font-size:14px;color:var(--c-text-light);margin:0;line-height:1.6;">' + r.desc + '</p>' +
            '<div style="margin-top:16px;font-size:13px;color:var(--c-gold);font-weight:600;">阅读全文 →</div>' +
          '</a>';
        }).join('');
      }
    }
  }

  // ============ 启动 ============
  function init() {
    renderHeader();
    renderFooter();
    renderFloat();
    renderDataDriven();
    bindNav();
    bindCountryTabs();
    bindAIDemo();
    bindConfigurator();
    bindFAQ();
    bindContactForm();
    bindNameCheck();
    bindScrollAnim();
    highlightNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
