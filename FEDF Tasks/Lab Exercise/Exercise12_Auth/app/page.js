'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    router.push('/dashboard')
    return null
  }

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <h1>🔐 Welcome to Authentication App</h1>
      <p style={{ marginBottom: 30, color: '#666' }}>
        Sign in to access your dashboard
      </p>
      <button
        onClick={() => signIn('google')}
        style={{
          padding: '12px 30px',
          fontSize: 16,
          cursor: 'pointer',
          background: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: 4
        }}
      >
        Sign in with Google
      </button>
    </div>
  )
}
