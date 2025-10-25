import { Link } from 'react-router-dom'

function BookList({ books }) {
  return (
    <div style={{maxWidth: 1000, margin: '0 auto'}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20}}>
        {books.map(book => (
          <div key={book.id} style={{
            background: 'white',
            border: '1px solid #ddd',
            padding: 24,
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            
            <div style={{marginBottom: 12}}>
              <h3 style={{margin: 0, marginBottom: 6, fontSize: 19, lineHeight: 1.3}}>
                <Link to={`/book/${book.id}`} style={{color: '#2c3e50', textDecoration: 'none', fontWeight: 600}}>
                  {book.title}
                </Link>
              </h3>
              <p style={{margin: 0, color: '#e67e22', fontSize: 14, fontWeight: 500}}>by {book.author}</p>
            </div>

            <div style={{fontSize: 13, color: '#7f8c8d', lineHeight: 1.5, marginBottom: 12}}>
              {book.description.substring(0, 120)}...
            </div>

            <div style={{display: 'flex', gap: 15, fontSize: 12, color: '#95a5a6'}}>
              <span>📅 {book.year}</span>
              <span>📖 {book.genre}</span>
              <span>⭐ {book.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookList
