(() => {
  const heading = document.querySelector('h1');
  const announcer = document.querySelector('#route-announcer');
  let cameFromThisSite = false;
  try { cameFromThisSite = new URL(document.referrer).origin === window.location.origin; } catch { /* Direct visit. */ }
  const navigation = performance.getEntriesByType('navigation')[0];
  const restoredFromHistory = navigation && navigation.type === 'back_forward';
  const focusHeading = () => {
    if (!heading) return;
    heading.focus();
    if (announcer) announcer.textContent = heading.textContent || 'Page loaded';
  };
  if (cameFromThisSite || restoredFromHistory) focusHeading();
  window.addEventListener('pageshow', (event) => { if (event.persisted) focusHeading(); });
})();
