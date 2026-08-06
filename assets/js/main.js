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
    var inSub = location.pathname.indexOf('/services/') > -1 || location.pathname.indexOf('/knowledge/') > -1;
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
          '<div class="footer-disclaimer">免责申明:本网站所收集的部分公开资料来源于互联网,转载目的在于传递更多信息及用于网络分享,并不代表本站赞同其观点和对其真实性负责。本站不对其版权负责,如有侵犯您的知识产权的作品,请联系我们及时修改或删除。</div>' +
        '</div>' +
      '</div>';
  }

  // ============ 漂浮客服 + 移动端底部 CTA 栏 ============
  function renderFloat() {
    if ($('#floatService')) return;
    var c = D.company || {};
    var f = el('div', { class: 'float-service', id: 'floatService' });
    f.innerHTML =
      '<a class="float-btn" href="' + relLink('ai-match.html') + '" title="AI 匹配"><span class="float-icon">🤖</span><span>AI</span></a>' +
      '<a class="float-btn" href="tel:' + (c.phone || '').replace(/-/g, '') + '" title="电话"><span class="float-icon">📞</span><span>电话</span></a>' +
      '<a class="float-btn" href="' + relLink('contact.html') + '" title="留言"><span class="float-icon">💬</span><span>留言</span></a>';
    document.body.appendChild(f);

    // 移动端底部固定 CTA 栏（CSS 仅移动端显示）
    if (!$('#mobileCtaBar')) {
      var bar = el('div', { class: 'mobile-cta-bar', id: 'mobileCtaBar' });
      bar.innerHTML =
        '<a class="btn btn-gold" href="' + relLink('ai-match.html') + '">🤖 AI 匹配</a>' +
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
    $all('.country-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var group = tab.getAttribute('data-group');
        var target = tab.getAttribute('data-target');
        $all('.country-tab[data-group="' + group + '"]').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        $all('.country-panel[data-group="' + group + '"]').forEach(function (p) { p.classList.remove('active'); });
        var panel = $('[data-panel="' + target + '"]');
        if (panel) panel.classList.add('active');
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
      if (q) q.addEventListener('click', function () { item.classList.toggle('open'); });
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

  // ============ 滚动淡入 ============
  function bindScrollAnim() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    $all('.feature-card, .service-card, .knowledge-card, .case-card, .region-card, .value-card').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
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
          '<div class="feature-icon">' + f.icon + '</div>' +
          '<div class="feature-title">' + f.title + '</div>' +
          '<div class="feature-tagline">' + f.tagline + '</div>' +
          '<div class="feature-desc">' + f.desc + '</div>' +
          '<a class="feature-link" href="' + relLink(f.link) + '">了解详情</a>' +
        '</div>';
      }).join('');
    }

    // 首页 8 大服务
    var svcHost = $('#servicesGrid');
    if (svcHost && D.services) {
      svcHost.innerHTML = D.services.map(function (s) {
        return '<a class="service-card" href="' + relLink(s.link) + '">' +
          '<div class="service-icon">' + s.icon + '</div>' +
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
        '<h3>🤖 AI 企服顾问实时演示</h3>' +
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
          '<div class="knowledge-cover">📄</div>' +
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
        return '<div class="faq-item"><div class="faq-q">' + f.q + '</div><div class="faq-a"><p>' + f.a + '</p></div></div>';
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
    bindScrollAnim();
    highlightNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
