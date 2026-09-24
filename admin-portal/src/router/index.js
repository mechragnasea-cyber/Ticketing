import { createRouter, createWebHistory } from 'vue-router'
import DashboardOverview from '../views/DashboardOverview.vue'
import DashboardCustomers from '../views/DashboardCustomers.vue'
import DashboardInvoices from '../views/DashboardInvoices.vue'
import DashboardSystem from '../views/DashboardSystem.vue'
import AdminPanel from '../views/AdminPanel.vue'
import TicketManagement from '../views/TicketManagement.vue'
import InvoiceManage from '../views/InvoiceManage.vue'
import Login from '../views/Login.vue'
import Maintenance from '../views/Maintenance.vue'
import AdminCreateTicket from '../views/AdminCreateTicket.vue'
import TicketDetails from '../views/TicketDetails.vue'
import InvoiceMaintenance from '../views/InvoiceMaintenance.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'DashboardOverview', component: DashboardOverview },
  { path: '/dashboard/customers', name: 'DashboardCustomers', component: DashboardCustomers },
  { path: '/dashboard/reports', name: 'DashboardInvoices', component: DashboardInvoices },
  { path: '/invoice-maintenance', name: 'InvoiceMaintenance', component: InvoiceMaintenance },
  { path: '/dashboard/system', name: 'DashboardSystem', component: DashboardSystem },
  { path: '/tickets', name: 'TicketManagement', component: TicketManagement },
  { path: '/tickets/:id', name: 'TicketDetails', component: TicketDetails },
  { path: '/admin-create-ticket', name: 'AdminCreateTicket', component: AdminCreateTicket },
  { path: '/admin-panel', name: 'AdminPanel', component: AdminPanel },
  { path: '/manage-reports', redirect: '/dashboard/reports' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/maintenance', name: 'Maintenance', component: Maintenance }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
