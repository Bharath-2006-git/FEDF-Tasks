'use client'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div style={{ padding: 50, textAlign: 'center' }}>Loading...</div>
  }

  if (!session) {
    redirect('/')
  }

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: 20 }}>
      <div style={{ background: 'white', padding: 30, border: '1px solid #ddd' }}>
        <h1>👋 Welcome to Dashboard</h1>
        
        <div style={{ margin: '30px 0', textAlign: 'center' }}>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              style={{ borderRadius: '50%', width: 100, height: 100 }}
            />
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <strong>Name:</strong> {session.user.name}
        </div>
        <div style={{ marginBottom: 30 }}>
          <strong>Email:</strong> {session.user.email}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
