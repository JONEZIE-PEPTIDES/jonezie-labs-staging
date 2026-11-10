(() => {
  const menu = document.querySelector('[data-brand-menu]');
  const trigger = menu?.querySelector('.brand-menu-trigger');
  const panel = menu?.querySelector('.brand-menu-panel');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const close = () => {
    if (panel) panel.hidden = true;
    trigger?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  trigger?.addEventListener('click', () => {
    const open = panel.hidden;
    close();
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  });
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    close();
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (event) => {
    if (!menu?.contains(event.target) && !nav?.contains(event.target) && !toggle?.contains(event.target)) close();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  panel?.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
})();
