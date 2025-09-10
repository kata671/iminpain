(function () {
  function ensureLink(href) {
    const links = Array.from(document.querySelectorAll('head link[rel="stylesheet"]'));
    if (links.some(l => (l.getAttribute('href') || '').trim() === href)) return null;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    return link;
  }
  function insertAfter(ref, node) {
    if (!ref || !node) return;
    if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
    else ref.parentNode.appendChild(node);
  }
  function orderHead() {
    const head = document.head;
    if (!head) return;
    let styleLink = Array.from(head.querySelectorAll('link[rel="stylesheet"]'))
      .find(l => (l.getAttribute('href') || '').trim() === 'style.css');
    if (!styleLink) { styleLink = ensureLink('style.css'); if (styleLink) head.insertBefore(styleLink, head.firstChild); }
    let wallLink = Array.from(head.querySelectorAll('link[rel="stylesheet"]'))
      .find(l => (l.getAttribute('href') || '').trim() === 'wallpaper.css');
    if (!wallLink) { wallLink = ensureLink('wallpaper.css'); if (wallLink) insertAfter(styleLink, wallLink); }
    const isDetails = /szczegoly\.html/i.test(location.pathname);
    if (isDetails) {
      let fixLink = Array.from(head.querySelectorAll('link[rel="stylesheet"]'))
        .find(l => (l.getAttribute('href') || '').trim() === 'fix.szczegoly.css');
      if (!fixLink) { fixLink = ensureLink('fix.szczegoly.css'); if (fixLink) insertAfter(wallLink || styleLink, fixLink); }
    }
  }
  function tweakBodyClass() {
    const isPomoc = /pomoc\.html/i.test(location.pathname);
    if (isPomoc) document.body.classList.add('pomoc');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { orderHead(); tweakBodyClass(); });
  } else { orderHead(); tweakBodyClass(); }
})();
