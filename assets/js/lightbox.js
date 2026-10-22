/* 下证样本灯箱:点击缩略图加载 1100px 大图,ESC 或点击背景关闭 */
(function () {
  var overlay = null;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = '<button class="lightbox-close" aria-label="关闭">&times;</button>' +
      '<img alt="" loading="eager" decoding="async">' +
      '<div class="lightbox-cap"></div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('lightbox-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

  function open(href, caption, alt) {
    if (!overlay) build();
    var img = overlay.querySelector('img');
    img.src = href;
    img.alt = alt || caption || '';
    overlay.querySelector('.lightbox-cap').textContent = caption || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-lightbox]');
    if (!link) return;
    e.preventDefault();
    var img = link.querySelector('img');
    open(link.getAttribute('href'), link.getAttribute('data-caption'), img ? img.alt : '');
  });
})();
