// ==========================================================================
// STJHUB Docs Pro - Interaction & Micro-animation Controller
// ==========================================================================

(function () {
  // 1. 初始化顶部阅读进度条
  function initProgressBar() {
    if (document.getElementById('reading-progress-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'reading-progress-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // 2. 鼠标跟随聚光灯 (Spotlight Effect)
  function initSpotlight() {
    const cards = document.querySelectorAll('.VPFeature, .VPHomeFeatures .item, .level-card, .card-item');
    cards.forEach(card => {
      if (!card.classList.contains('spotlight-card')) {
        card.classList.add('spotlight-card');
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      }
    });
  }

  // 3. 页面初次加载与 SPA 路由切换兼容
  function setup() {
    initProgressBar();
    initSpotlight();

    // 监听 DOM 树变化（适配 Vue 客户端路由切换）
    const observer = new MutationObserver(() => {
      initSpotlight();
    });

    const app = document.getElementById('app') || document.body;
    observer.observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
