
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'start', component: () => import('pages/Index.vue') },
      { path: 'selectdb', name: 'selectDB', component: () => import('pages/SelectDB.vue') },
      { path: 'about', name: 'About', component: () => import('pages/About.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
