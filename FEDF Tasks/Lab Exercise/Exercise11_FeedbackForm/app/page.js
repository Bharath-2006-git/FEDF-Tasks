'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => data.success && setFeedbacks(data.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !comment) return alert('Fill all fields')

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, comment })
    })

    if (res.ok) {
      setName('')
      setComment('')
      const data = await res.json()
      setFeedbacks([data.data, ...feedbacks])
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>💬 Feedback Form</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <div style={{ marginBottom: 15 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ width: '100%', padding: 10, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your feedback"
            rows={3}
            style={{ width: '100%', padding: 10, boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>

      <h2>All Feedback ({feedbacks.length})</h2>
      {feedbacks.map((fb) => (
        <div key={fb._id} style={{ marginBottom: 15, padding: 15, background: '#f5f5f5' }}>
          <strong>{fb.name}</strong>
          <p style={{ margin: '5px 0' }}>{fb.comment}</p>
          <small>{new Date(fb.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
