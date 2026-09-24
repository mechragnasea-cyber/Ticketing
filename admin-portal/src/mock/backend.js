const TICKETS_KEY='admin_tickets'; const INVOICES_KEY='admin_invoices';
const NOTIFICATIONS_KEY='admin_notifications';
function read(k){ try{ return JSON.parse(localStorage.getItem(k)||'[]') }catch{ return [] } }
function write(k,v){ localStorage.setItem(k, JSON.stringify(v)) }

const STATUS_ALIASES = {
  Open: 'New',
  in_progress: 'In Progress',
  Pending: 'Waiting for Customer'
}

function canonicalStatus(status){ return STATUS_ALIASES[status] || status || 'New' }
function slaHours(priority){ return priority === 'Critical' ? 4 : priority === 'High' ? 8 : priority === 'Normal' ? 24 : 48 }

function normalizeTicket(ticket){
  const base = {
    id: ticket.id,
    invoiceNumber: ticket.invoiceNumber || '',
    subject: ticket.subject || '',
    issues: ticket.issues || ticket.subject || '',
    description: ticket.description || ticket.issues || '',
    status: canonicalStatus(ticket.status),
    priority: ticket.priority || 'Normal',
    assignedTo: ticket.assignedTo || 'Unassigned',
    assignedBy: ticket.assignedBy || '',
    requester: ticket.requester || '',
    createdAt: ticket.createdAt || new Date().toISOString(),
    dueAt: ticket.dueAt || new Date(new Date(ticket.createdAt || Date.now()).getTime() + slaHours(ticket.priority || 'Normal') * 3600000).toISOString(),
    resolvedAt: ticket.resolvedAt || null,
    comments: Array.isArray(ticket.comments) ? ticket.comments : [],
    historyLogs: Array.isArray(ticket.historyLogs) ? ticket.historyLogs : [],
    statusHistory: Array.isArray(ticket.statusHistory) ? ticket.statusHistory : []
  }

  if (!base.statusHistory.length && base.createdAt) {
    base.statusHistory = [{ status: 'Created', time: new Date(base.createdAt).toLocaleString() }]
  }

  return base
}

function appendHistory(ticket, action, details, userName='System'){
  const item = {
    id: Date.now() + Math.random(),
    action,
    details,
    userName,
    time: new Date().toISOString()
  }
  const history = Array.isArray(ticket.historyLogs) ? ticket.historyLogs : []
  history.unshift(item)
  return history
}

function addNotification(message, ticketId, type='info'){
  const notifications = read(NOTIFICATIONS_KEY)
  notifications.unshift({ id: Date.now() + Math.random(), message, ticketId, type, read: false, createdAt: new Date().toISOString() })
  write(NOTIFICATIONS_KEY, notifications.slice(0, 50))
}

export default {
  getTickets(){ return read(TICKETS_KEY).map(normalizeTicket) },
  getNotifications(){ return read(NOTIFICATIONS_KEY) },
  markNotificationsRead(){ write(NOTIFICATIONS_KEY, read(NOTIFICATIONS_KEY).map(item => ({ ...item, read: true }))) },
  saveTicket(t){
    const a=read(TICKETS_KEY)
    const id=Date.now();
    const rec=normalizeTicket({ id, ...t, status:t.status||'New', createdAt:new Date().toISOString() })
    if (!rec.historyLogs.length) {
      rec.historyLogs = appendHistory(rec, 'Created', 'Ticket created', t.assignedBy || 'System')
    }
    addNotification(`New ticket ${rec.id} was created`, rec.id, 'new')
    a.unshift(rec)
    write(TICKETS_KEY,a)
    return rec
  },
  updateTicket(id,patch){
    const a=read(TICKETS_KEY)
    const idx=a.findIndex(x=>x.id===id)
    if(idx===-1) return null

    const current = normalizeTicket(a[idx])
    const next = { ...current, ...patch }

    if (patch.assignedTo && patch.assignedTo !== current.assignedTo) {
      next.assignedBy = patch.assignedBy || next.assignedBy || 'System'
      next.historyLogs = appendHistory(next, 'Assigned', `Assigned to ${patch.assignedTo}`, next.assignedBy)
      addNotification(`Ticket ${next.id} assigned to ${patch.assignedTo}`, next.id, 'assignment')
    }

    if (patch.status && patch.status !== current.status) {
      next.status = canonicalStatus(patch.status)
      const statusLog = { status: next.status, time: new Date().toLocaleString() }
      next.statusHistory = Array.isArray(next.statusHistory) ? [statusLog, ...next.statusHistory] : [statusLog]
      if (next.status === 'Resolved' || next.status === 'Closed') next.resolvedAt = new Date().toISOString()
      next.historyLogs = appendHistory(next, 'Status Updated', `Status changed to ${next.status}`, patch.updatedBy || 'System')
      addNotification(`Ticket ${next.id} status changed to ${next.status}`, next.id, 'status')
    }

    if (Array.isArray(patch.comments)) {
      next.comments = patch.comments
      if (patch.comments.length > current.comments.length) {
        next.historyLogs = appendHistory(next, 'Comment Added', patch.comments[patch.comments.length - 1].text || 'New comment', patch.comments[patch.comments.length - 1].author || 'System')
        addNotification(`New comment added to ticket ${next.id}`, next.id, 'comment')
      }
    }

    const normalized = normalizeTicket(next)
    a[idx] = normalized
    write(TICKETS_KEY,a)
    return normalized
  },
  getInvoices(){ return read(INVOICES_KEY) }, saveInvoice(inv){ const a=read(INVOICES_KEY); a.unshift(inv); write(INVOICES_KEY,a); return inv }
}

function seedIfEmpty(){
  try{
    if(!localStorage.getItem(INVOICES_KEY) || read(INVOICES_KEY).length===0){
      const invs = [
        { id: Date.now()-250000, number: 'ADM-INV-9001', amount: 1500.00, customer: 'Gamma Inc', date: new Date().toISOString() },
        { id: Date.now()-150000, number: 'ADM-INV-9002', amount: 250.00, customer: 'Delta Co', date: new Date().toISOString() }
      ]
      write(INVOICES_KEY, invs)
    }
    if(!localStorage.getItem(TICKETS_KEY) || read(TICKETS_KEY).length===0){
      const t = [
        {
          id: Date.now()-80000,
          invoiceNumber: 'ADM-INV-9001',
          subject: 'Server reboot required',
          description: 'Monthly maintenance reboot',
          status: 'Open',
          assignedTo: 'John Smith',
          assignedBy: 'Admin',
          comments: [{ id: Date.now()-1, author: 'Admin', text: 'Need reboot after hours.', time: new Date().toISOString() }],
          historyLogs: [{ id: Date.now()-2, action: 'Assigned', details: 'Assigned to John Smith', userName: 'Admin', time: new Date().toISOString() }],
          statusHistory: [{ status: 'Created', time: new Date().toLocaleString() }, { status: 'Open', time: new Date().toLocaleString() }],
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now()-40000,
          invoiceNumber: 'ADM-INV-9002',
          subject: 'Replace battery',
          description: 'UPS battery nearing EOL',
          status: 'Closed',
          assignedTo: 'Sarah Lee',
          assignedBy: 'Manager',
          comments: [],
          historyLogs: [{ id: Date.now()-3, action: 'Assigned', details: 'Assigned to Sarah Lee', userName: 'Manager', time: new Date().toISOString() }],
          statusHistory: [{ status: 'Created', time: new Date().toLocaleString() }, { status: 'Closed', time: new Date().toLocaleString() }],
          createdAt: new Date().toISOString()
        }
      ]
      write(TICKETS_KEY, t)
    }
  }catch(e){ console.warn('seed admin-portal failed', e) }
}

seedIfEmpty()
