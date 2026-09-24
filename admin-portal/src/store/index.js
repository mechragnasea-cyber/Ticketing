import { defineStore } from 'pinia'

function normalizeTicket(ticket = {}) {
  const statusAliases = { Open: 'New', in_progress: 'In Progress', Pending: 'Waiting for Customer' }
  const status = statusAliases[ticket.status] || ticket.status || 'New'
  const priority = ticket.priority || 'Normal'
  const slaHours = priority === 'Critical' ? 4 : priority === 'High' ? 8 : priority === 'Normal' ? 24 : 48
  const createdAt = ticket.createdAt || new Date().toISOString()
  return {
    ...ticket,
    status,
    priority,
    createdAt,
    dueAt: ticket.dueAt || new Date(new Date(createdAt).getTime() + slaHours * 3600000).toISOString(),
    assignedTo: ticket.assignedTo || 'Unassigned',
    comments: Array.isArray(ticket.comments) ? ticket.comments : [],
    historyLogs: Array.isArray(ticket.historyLogs) ? ticket.historyLogs : [],
    statusHistory: Array.isArray(ticket.statusHistory) ? ticket.statusHistory : [],
    resolvedAt: ticket.resolvedAt || null,
  }
}

export const useAdminStore = defineStore('admin', {
  state: () => ({ user: null, tickets: [], invoices: [], maintenance: false }),
  actions: {
    init(){
      this.tickets = (JSON.parse(localStorage.getItem('admin_tickets') || '[]')).map(normalizeTicket)
      this.invoices = JSON.parse(localStorage.getItem('admin_invoices') || '[]')
      this.maintenance = JSON.parse(localStorage.getItem('admin_maintenance') || 'false')
    },
    saveTicket(t){
      const next = normalizeTicket(t)
      this.tickets.unshift(next)
      localStorage.setItem('admin_tickets', JSON.stringify(this.tickets))
      return next
    },
    updateTicket(id, patch){
      const idx = this.tickets.findIndex(x => x.id === id)
      if (idx === -1) return null

      this.tickets[idx] = normalizeTicket({ ...this.tickets[idx], ...patch })
      localStorage.setItem('admin_tickets', JSON.stringify(this.tickets))
      return this.tickets[idx]
    },
    get unreadNotifications(){
      try { return JSON.parse(localStorage.getItem('admin_notifications') || '[]').filter(item => !item.read) } catch { return [] }
    }
  }
})
