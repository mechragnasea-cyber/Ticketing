const INVOICES_KEY = 'cust_invoices'
const TICKETS_KEY = 'cust_tickets'
function read(k){ try{ return JSON.parse(localStorage.getItem(k)||'[]') }catch{ return [] } }
function write(k,v){ localStorage.setItem(k, JSON.stringify(v)) }

function normalizeTicket(ticket = {}) {
  return {
    id: ticket.id,
    invoiceNumber: ticket.invoiceNumber || '',
    subject: ticket.subject || '',
    description: ticket.description || '',
    status: ticket.status || 'Pending',
    priority: ticket.priority || 'Normal',
    createdAt: ticket.createdAt || new Date().toISOString(),
    assignee: ticket.assignee || 'Unassigned',
    comments: Array.isArray(ticket.comments) ? ticket.comments : [],
    historyLogs: Array.isArray(ticket.historyLogs) ? ticket.historyLogs : [],
    statusHistory: Array.isArray(ticket.statusHistory) ? ticket.statusHistory : []
  }
}

export default {
  getTickets(){ return read(TICKETS_KEY).map(normalizeTicket) },
  getInvoices(){ return read(INVOICES_KEY) },
  saveInvoice(inv){ const a=read(INVOICES_KEY); a.unshift(inv); write(INVOICES_KEY,a); return inv },
  validateInvoice(number){ const a=read(INVOICES_KEY); return a.find(x=>x.number===number)||null },
  saveTicket(t){
    const a=read(TICKETS_KEY)
    const id=Date.now();
    const rec = normalizeTicket({ id, ...t, status:'Pending', createdAt:new Date().toISOString() })
    rec.historyLogs = [{ id: Date.now(), action: 'Created', details: 'Ticket created', userName: 'Customer', time: new Date().toISOString() }]
    rec.statusHistory = [{ status: 'Created', time: new Date().toLocaleString() }, { status: 'Pending', time: new Date().toLocaleString() }]
    a.unshift(rec)
    write(TICKETS_KEY,a)
    return rec
  }
}

function seedIfEmpty(){
  try{
    if(!localStorage.getItem(INVOICES_KEY) || read(INVOICES_KEY).length===0){
      const sample = [
        { id: Date.now()-200000, number: 'CUST-INV-5001', amount: 299.99, customer: 'Jane Doe', date: new Date().toISOString() },
        { id: Date.now()-100000, number: 'CUST-INV-5002', amount: 79.50, customer: 'John Smith', date: new Date().toISOString() }
      ]
      write(INVOICES_KEY, sample)
    }
    if(!localStorage.getItem(TICKETS_KEY) || read(TICKETS_KEY).length===0){
      const sampleT = [
        {
          id: Date.now()-50000,
          invoiceNumber: 'CUST-INV-5001',
          subject: 'Service request: AC',
          description: 'AC making noise',
          status: 'Pending',
          priority: 'High',
          assignee: 'John Smith',
          createdAt: new Date().toISOString(),
          comments: [{ id: Date.now()-1, author: 'Support', text: 'We are reviewing the request.', time: new Date().toISOString() }],
          historyLogs: [
            { id: Date.now()-2, action: 'Created', details: 'Ticket created by customer.', userName: 'Customer', time: new Date().toISOString() },
            { id: Date.now()-3, action: 'Assigned', details: 'Assigned to John Smith.', userName: 'Support Team', time: new Date().toISOString() }
          ],
          statusHistory: [{ status: 'Created', time: new Date().toLocaleString() }, { status: 'Pending', time: new Date().toLocaleString() }]
        }
      ]
      write(TICKETS_KEY, sampleT)
    }
  }catch(e){ console.warn('seed customer-portal failed', e) }
}

seedIfEmpty()
