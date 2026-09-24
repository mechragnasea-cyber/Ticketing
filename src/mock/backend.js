const TICKETS_KEY = 'tickets_db_v1'
const USERS_KEY = 'users_db_v1'
const INVOICES_KEY = 'invoices_db_v1'

function read(key){
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function write(key, data){ localStorage.setItem(key, JSON.stringify(data)) }

const backend = {
  async getTickets(){ return read(TICKETS_KEY) },
  async getInvoices(){ return read(INVOICES_KEY) },
  async saveTicket(ticket){
    const items = read(TICKETS_KEY)
    const id = Date.now()
    const t = { id, ...ticket, status: 'open', createdAt: new Date().toISOString() }
    items.unshift(t)
    write(TICKETS_KEY, items)
    return t
  },
  async updateTicket(id, patch){
    const items = read(TICKETS_KEY)
    const idx = items.findIndex(x=>x.id===id)
    if (idx === -1) throw new Error('Ticket not found')
    items[idx] = { ...items[idx], ...patch }
    write(TICKETS_KEY, items)
    return items[idx]
  },
  async saveInvoice(inv){
    const items = read(INVOICES_KEY)
    const record = { id: Date.now(), ...inv }
    items.unshift(record)
    write(INVOICES_KEY, items)
    return record
  },
  async validateInvoice(number){
    const inv = read(INVOICES_KEY)
    return inv.find(i=>i.number === number) || null
  },
  async tryWindowsAuth(){
    // stub: in a real environment integrate with AD/SSO. Here we simulate none.
    return null
  },
  async login(username, password){
    const users = read(USERS_KEY)
    const u = users.find(x=>x.username===username && x.password===password)
    return u ? { username: u.username, role: u.role } : null
  },
  async register(user){
    const users = read(USERS_KEY)
    users.unshift(user)
    write(USERS_KEY, users)
    return { username: user.username, role: user.role }
  }
}

function seedIfEmpty(){
  try{
    if(!localStorage.getItem(USERS_KEY) || read(USERS_KEY).length===0){
      const sampleUsers = [
        { username: 'admin', password: 'admin', role: 'Admin' },
        { username: 'support', password: 'support', role: 'Support' },
        { username: 'customer1', password: 'cust123', role: 'Customer' }
      ]
      write(USERS_KEY, sampleUsers)
    }
    if(!localStorage.getItem(INVOICES_KEY) || read(INVOICES_KEY).length===0){
      const sampleInv = [
        { id: Date.now()-300000, number: 'INV-1001', amount: 450.00, customer: 'Acme Corp', date: new Date().toISOString() },
        { id: Date.now()-200000, number: 'INV-1002', amount: 1200.00, customer: 'Beta LLC', date: new Date().toISOString() }
      ]
      write(INVOICES_KEY, sampleInv)
    }
    if(!localStorage.getItem(TICKETS_KEY) || read(TICKETS_KEY).length===0){
      const sampleTickets = [
        { id: Date.now()-100000, invoiceNumber: 'INV-1001', subject: 'Printer not working', description: 'Office printer shows paper jam but clear.', status: 'open', createdAt: new Date().toISOString() },
        { id: Date.now()-50000, invoiceNumber: 'INV-1002', subject: 'Network outage', description: 'Intermittent network in 3rd floor.', status: 'in_progress', createdAt: new Date().toISOString() }
      ]
      write(TICKETS_KEY, sampleTickets)
    }
  }catch(e){ console.warn('seeding sample data failed', e) }
}

seedIfEmpty()

export default backend
