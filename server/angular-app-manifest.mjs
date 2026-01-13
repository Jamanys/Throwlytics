
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/throlytics/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/throlytics"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24809, hash: '9206e18b3f975e4f41e18f33f5e129fd9ce812a59e17204dbc53afbb8949800d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17132, hash: 'fd2508127aafe227957b40b1b2019655a4dc05cf4dee1b483ae862f97b53c0ca', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 145083, hash: 'b4745a8172ebd7cacb2a7b9c68b3e687ac42781604b10837840f53f7ea642854', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-RGT5VN7R.css': {size: 8236, hash: '35Tri2eaYdY', text: () => import('./assets-chunks/styles-RGT5VN7R_css.mjs').then(m => m.default)}
  },
};
