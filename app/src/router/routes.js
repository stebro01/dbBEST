import store from "src/store/index"

function beforeEnterFunc (to, from, next) {
  if (!store.getters.SETTINGS || store.getters.SETTINGS.filename === null) next({ name: 'selectDB' })
  else next()
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'start', component: () => import('pages/Index.vue'), beforeEnter: beforeEnterFunc },
      { path: 'tables', name: 'Tables', component: () => import('pages/Tables.vue'), beforeEnter: beforeEnterFunc },
      { path: 'patients', name: 'Patients', component: () => import('pages/Patients.vue'), beforeEnter: beforeEnterFunc },
      { path: 'visits/:id', name: 'Visits', component: () => import('pages/Visits.vue'), beforeEnter: beforeEnterFunc },
      { path: 'selectdb', name: 'selectDB', component: () => import('pages/SelectDB.vue') },
      { path: 'settings', name: 'Settings', component: () => import('pages/Settings.vue') },
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
