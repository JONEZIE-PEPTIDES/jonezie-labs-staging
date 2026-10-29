(() => {
  const scene = document.querySelector('[data-featured-promo]');
  if (!scene || !('IntersectionObserver' in window)) return;

  let inView = false;
  const update = () => {
    scene.dataset.active = String(inView && !document.hidden);
  };
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  }, { threshold: 0.15 });

  observer.observe(scene);
  document.addEventListener('visibilitychange', update);
})();
