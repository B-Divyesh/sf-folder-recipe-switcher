(() => {
  const heading = document.querySelector('h1');
  const announcer = document.querySelector('#route-announcer');
  let cameFromThisSite = false;
  try { cameFromThisSite = new URL(document.referrer).origin === window.location.origin; } catch { /* Direct visit. */ }
  const focusHeading = () => {
    if (!heading) return;
    heading.focus();
    if (announcer) announcer.textContent = heading.textContent || 'Page loaded';
  };
  if (cameFromThisSite) focusHeading();
  window.addEventListener('pageshow', (event) => { if (event.persisted) focusHeading(); });
})();
