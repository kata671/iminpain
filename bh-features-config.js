// bh-features-config.js (merged flags)
window.BH = window.BH || {};
window.BH.features = Object.assign({
  bodymap: false,   // hide 2D if 3D is on
  patterns: true,
  tracker: true,
  body3d: true      // enable 3D viewer
}, window.BH.features||{});
