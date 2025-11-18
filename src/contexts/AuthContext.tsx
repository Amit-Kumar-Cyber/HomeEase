import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi, profileApi, Profile } from '../lib/api'

type AuthContextType = {
  user: { id: string; email: string; full_name: string; role: string } | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, phone: string, role: 'user' | 'worker') => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string; full_name: string; role: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const profileData = await profileApi.getMe()
      setProfile(profileData)
      setUser({
        id: profileData._id,
        email: profileData.email,
        full_name: profileData.full_name,
        role: profileData.role
      })
      return profileData
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchProfile().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const data = await authApi.signIn(email, password)
    setUser(data.user)
    await fetchProfile()
  }

  const signUp = async (email: string, password: string, fullName: string, phone: string, role: 'user' | 'worker') => {
    const data = await authApi.signUp(email, password, fullName, phone, role)
    setUser(data.user)
    await fetchProfile()
  }

  const signOut = () => {
    authApi.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
