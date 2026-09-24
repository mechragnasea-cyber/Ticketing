const API_ROOT = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'ticketing_access_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const json = decodeURIComponent(atob(payload.replace(/-/g, '+').replace(/_/g, '/')).split('').map(character => `%${(`00${character.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''))
    const claims = JSON.parse(json)
    const roles = claims.role || claims.roles || []
    return {
      username: claims.unique_name || claims.name || claims.sub,
      role: Array.isArray(roles) ? roles[0] : roles
    }
  } catch {
    return null
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')

  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_ROOT}${path}`, { ...options, headers })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const error = await response.json()
      message = error.error || error.title || error.message || message
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

function normalizeTicket(ticket) {
  return {
    ...ticket,
    subject: ticket.subject || ticket.title || '',
    title: ticket.title || ticket.subject || ''
  }
}

async function authenticate(path, username, password) {
  const result = await request(path, {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
  if (!result?.token) throw new Error('The server did not return an access token.')
  localStorage.setItem(TOKEN_KEY, result.token)
  return decodeToken(result.token) || { username }
}

const backend = {
  async init() {
    const token = getToken()
    return token ? decodeToken(token) : null
  },

  async getTickets() {
    const tickets = await request('/tickets')
    return tickets.map(normalizeTicket)
  },

  async getInvoices() {
    return []
  },

  async saveTicket(ticket) {
    const saved = await request('/tickets', {
      method: 'POST',
      body: JSON.stringify({
        title: ticket.title || ticket.subject || ticket.type || 'Service request',
        description: ticket.description || ticket.issues || JSON.stringify(ticket),
        priority: ticket.priority || 'Normal'
      })
    })
    return normalizeTicket(saved)
  },

  async updateTicket(id, patch, current) {
    const ticket = current || {}
    await request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        title: patch.title || ticket.title || patch.subject || ticket.subject || '',
        description: patch.description || ticket.description || '',
        status: patch.status || ticket.status || '',
        priority: patch.priority || ticket.priority || 'Normal',
        assignedToUserId: patch.assignedToUserId ?? ticket.assignedToUserId ?? null
      })
    })
    return normalizeTicket({ ...ticket, ...patch, id })
  },

  async validateInvoice() {
    return null
  },

  async tryWindowsAuth() {
    return null
  },

  login(username, password) {
    return authenticate('/authentication/login', username, password)
  },

  register(username, password) {
    return authenticate('/authentication/register', username, password)
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export default backend