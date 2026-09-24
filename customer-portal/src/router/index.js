import { createRouter, createWebHistory } from 'vue-router'
import CreateTicket from '../views/CreateTicket.vue'
import CheckTicket from '../views/CheckTicket.vue'
import CustomerHome from '../views/CustomerHome.vue'

const routes = [
  { path: '/', name: 'CustomerHome', component: CustomerHome },
  { path: '/create-ticket', name: 'CreateTicket', component: CreateTicket },
  { path: '/check-ticket', name: 'CheckTicket', component: CheckTicket }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
