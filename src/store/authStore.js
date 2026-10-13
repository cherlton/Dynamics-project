import { create } from 'zustand'

// Mock JWT-like token creation
const createMockToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    exp: Date.now() + 3600000,
    name: user.name,
  }
  return btoa(JSON.stringify({ alg: 'HS256' })) + '.' + btoa(JSON.stringify(payload)) + '.mock-signature'
}

const parseToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

// Demo accounts
const DEMO_ACCOUNTS = {
  'admin@demo.co.za': {
    id: 'admin-001',
    email: 'admin@demo.co.za',
    password: 'Admin#12345',
    role: 'admin',
    emailVerified: true,
    name: 'Sarah Johnson',
  },
  'candidate@demo.co.za': {
    id: 'cand-001',
    email: 'candidate@demo.co.za',
    password: 'Candidate#12345',
    role: 'candidate',
    emailVerified: true,
    name: 'Thabo Mokoena',
  },
}

export const useAuthStore = create((set, get) => ({
  token: sessionStorage.getItem('auth_token'),
  user: sessionStorage.getItem('auth_token') ? parseToken(sessionStorage.getItem('auth_token')) : null,
  registeredUsers: { ...DEMO_ACCOUNTS },
  loginAttempts: 0,
  
  login: (email, password) => {
    const { registeredUsers, loginAttempts } = get()
    
    if (loginAttempts >= 5) {
      return { success: false, error: 'Too many failed attempts. Please wait before trying again.' }
    }
    
    const user = registeredUsers[email.toLowerCase()]
    if (!user || user.password !== password) {
      set({ loginAttempts: loginAttempts + 1 })
      return { success: false, error: 'Email or password is incorrect.' }
    }
    
    if (!user.emailVerified) {
      return { success: false, error: 'unverified', email: user.email }
    }
    
    const token = createMockToken(user)
    sessionStorage.setItem('auth_token', token)
    set({ token, user: parseToken(token), loginAttempts: 0 })
    return { success: true, role: user.role }
  },
  
  register: (email, password, name) => {
    const { registeredUsers } = get()
    if (registeredUsers[email.toLowerCase()]) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    
    const newUser = {
      id: 'cand-' + Date.now(),
      email: email.toLowerCase(),
      password,
      role: 'candidate',
      emailVerified: false,
      name,
    }
    
    set({
      registeredUsers: { ...registeredUsers, [email.toLowerCase()]: newUser }
    })
    
    return { success: true }
  },
  
  verifyEmail: (email) => {
    const { registeredUsers } = get()
    const user = registeredUsers[email?.toLowerCase()]
    if (!user) return { success: false }
    
    const updatedUser = { ...user, emailVerified: true }
    const updatedUsers = { ...registeredUsers, [email.toLowerCase()]: updatedUser }
    
    const token = createMockToken(updatedUser)
    sessionStorage.setItem('auth_token', token)
    set({
      registeredUsers: updatedUsers,
      token,
      user: parseToken(token),
    })
    return { success: true }
  },
  
  logout: () => {
    sessionStorage.removeItem('auth_token')
    set({ token: null, user: null })
  },
  
  getSession: () => {
    const { token } = get()
    if (!token) return null
    return parseToken(token)
  },
}))
