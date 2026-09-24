import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({ invoices: [], tickets: [] }),
  actions: {
    loadInvoices(){ const raw = localStorage.getItem('cust_invoices') || '[]'; this.invoices = JSON.parse(raw) },
    saveInvoice(inv){ this.invoices.unshift(inv); localStorage.setItem('cust_invoices', JSON.stringify(this.invoices)) },
    saveTicket(t){ this.tickets.unshift(t); localStorage.setItem('cust_tickets', JSON.stringify(this.tickets)); return t }
  }
})
