import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFeedback } from './store/feedbackSlice'

function App() {
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  
  const dispatch = useDispatch()
  const feedbackEntries = useSelector(state => state.feedback.entries)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!rating) {
      setError('Please select a rating')
      return
    }

    dispatch(addFeedback({ rating: parseInt(rating), comment }))
    setRating('')
    setComment('')
    setError('')
  }

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5', padding: 20}}>
      <div style={{maxWidth: 700, margin: '0 auto'}}>
        
        {/* Header */}
        <header style={{textAlign: 'center', marginBottom: 30}}>
          <h1 style={{color: '#1e293b', fontSize: 32, margin: 0}}>📝 Training Feedback</h1>
          <p style={{color: '#64748b', margin: '8px 0 0'}}>Rate your experience and share your thoughts</p>
        </header>

        {/* Feedback Form */}
        <div style={{background: 'white', padding: 30, marginBottom: 30, border: '1px solid #e2e8f0'}}>
          <h2 style={{margin: '0 0 20px', color: '#1e293b', fontSize: 20}}>Submit Your Feedback</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Rating Selection */}
            <div style={{marginBottom: 20}}>
              <label style={{display: 'block', marginBottom: 10, color: '#334155', fontWeight: 600}}>
                Rating <span style={{color: '#ef4444'}}>*</span>
              </label>
              <div style={{display: 'flex', gap: 10}}>
                {[1, 2, 3, 4, 5].map(num => (
                  <label key={num} style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid',
                    borderColor: rating == num ? '#3b82f6' : '#e2e8f0',
                    background: rating == num ? '#eff6ff' : 'white',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: rating == num ? '#3b82f6' : '#64748b'
                  }}>
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={rating == num}
                      onChange={(e) => setRating(e.target.value)}
                      style={{display: 'none'}}
                    />
                    {num} ⭐
                  </label>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div style={{marginBottom: 20}}>
              <label style={{display: 'block', marginBottom: 10, color: '#334155', fontWeight: 600}}>
                Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with us..."
                style={{
                  width: '100%',
                  padding: 12,
                  border: '2px solid #e2e8f0',
                  fontSize: 14,
                  minHeight: 100,
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{padding: 12, background: '#fee2e2', color: '#dc2626', marginBottom: 15, fontSize: 14}}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: 14,
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div style={{background: 'white', padding: 30, border: '1px solid #e2e8f0'}}>
          <h2 style={{margin: '0 0 20px', color: '#1e293b', fontSize: 20}}>
            All Feedback ({feedbackEntries.length})
          </h2>
          
          {feedbackEntries.length === 0 ? (
            <p style={{color: '#94a3b8', textAlign: 'center', padding: 40}}>
              No feedback submitted yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
              {feedbackEntries.map(entry => (
                <div key={entry.id} style={{
                  padding: 20,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
                    <div style={{fontSize: 18, fontWeight: 600, color: '#3b82f6'}}>
                      {'⭐'.repeat(entry.rating)} {entry.rating}/5
                    </div>
                    <div style={{fontSize: 12, color: '#94a3b8'}}>
                      {entry.timestamp}
                    </div>
                  </div>
                  {entry.comment && (
                    <p style={{margin: 0, color: '#475569', lineHeight: 1.6}}>
                      {entry.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
