import { defineStore } from 'pinia'
import backend from '../api/client'

export const useMainStore = defineStore('main', {
  state: () => ({
    user: null,
    maintenance: false,
    tickets: [],
    invoices: [],
    initialized: false,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    stats: (s) => {
      const open = s.tickets.filter(t=>String(t.status).toLowerCase()==='open').length
      const closed = s.tickets.filter(t=>String(t.status).toLowerCase()==='closed').length
      const pending = s.tickets.filter(t=>String(t.status).toLowerCase()==='pending').length
      return { open, closed, pending }
    }
  },
  actions: {
    async init() {
      if (this.initialized || this.loading) return
      this.loading = true
      this.error = null
      try {
        this.user = await backend.init()
        this.tickets = await backend.getTickets()
        this.invoices = await backend.getInvoices()
        this.initialized = true
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async updateTicket(id, patch){
      const current = this.tickets.find(t=>t.id===id)
      const updated = await backend.updateTicket(id, patch, current)
      const idx = this.tickets.findIndex(t=>t.id===id)
      if (idx !== -1) this.tickets.splice(idx,1,updated)
      return updated
    },
    async login(username, password) {
      const u = await backend.login(username, password)
      this.user = u
      return u
    },
    logout() { backend.logout(); this.user = null },
    async register(username, password, role='Customer') {
      const u = await backend.register(username, password)
      this.user = u
      return u
    },
    async submitTicket(ticket) {
      const saved = await backend.saveTicket(ticket)
      this.tickets.unshift(saved)
      return saved
    },
    async validateInvoice(number) {
      return backend.validateInvoice(number)
    },
    async uploadInvoice(invoice) {
      const r = await backend.saveInvoice(invoice)
      this.invoices.unshift(r)
      return r
    }
  }
})

export default useMainStore
