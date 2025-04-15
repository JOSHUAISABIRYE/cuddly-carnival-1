
// app/AppWrapper.js
'use client'
import { AuthProvider } from '../context/AuthContext'

export default function AppWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
