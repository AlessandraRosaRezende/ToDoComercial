import { createContext, useContext, useState, ReactNode } from 'react'

interface User { name: string; email: string }

interface UserCtx {
  user: User | null
  setUser: (u: User) => void
}

const Ctx = createContext<UserCtx>({ user: null, setUser: () => { } })

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('followup_user')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const setUser = (u: User) => {
    localStorage.setItem('followup_user', JSON.stringify(u))
    setUserState(u)
  }

  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>
}

export const useUser = () => useContext(Ctx)