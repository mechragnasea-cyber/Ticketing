import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '../store'

import Dashboard from '../views/Dashboard.vue'
import TicketForm from '../views/TicketForm.vue'
import Login from '../views/Login.vue'
import InvoiceUpload from '../views/InvoiceUpload.vue'
import Maintenance from '../views/Maintenance.vue'
import TicketManagement from '../views/TicketManagement.vue'
import UserManagement from '../views/UserManagement.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/submit-ticket', name: 'TicketForm', component: TicketForm },
  { path: '/create-ticket', name: 'CreateTicket', component: () => import('../views/CreateTicket.vue') },
  // Ticketing page for support/admin — requires login
  { path: '/ticketing', name: 'Ticketing', component: () => import('../views/AdminTicketing.vue'), meta: { requiresAuth: true } },
  { path: '/service-order', name: 'ServiceOrder', component: () => import('../views/ServiceOrderForm.vue'), meta: { requiresAuth: false, requiresInvoice: true } },
  { path: '/validate-invoice', name: 'InvoiceValidation', component: () => import('../views/InvoiceValidation.vue') },
  { path: '/login', name: 'Login', component: Login },
  { path: '/upload-invoice', name: 'InvoiceUpload', component: InvoiceUpload },
  { path: '/maintenance', name: 'Maintenance', component: Maintenance },
  { path: '/tickets', name: 'TicketManagement', component: TicketManagement, meta: { requiresAuth: true } },
  { path: '/users', name: 'UserManagement', component: UserManagement, meta: { requiresAuth: true, roles: ['Admin'] } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useMainStore()
  if (store.maintenance && to.name !== 'Maintenance') {
    return next({ name: 'Maintenance' })
  }
  if (to.meta && to.meta.requiresAuth && !store.isAuthenticated) {
    return next({ name: 'Login' })
  }
  if (to.meta && to.meta.requiresInvoice) {
    // require invoice query param
    if (!to.query || !to.query.invoice) return next({ name: 'InvoiceValidation' })
  }
  if (to.meta && to.meta.roles) {
    const roles = to.meta.roles
    if (!roles.includes(store.user?.role)) return next({ name: 'Dashboard' })
  }
  next()
})

export default router
