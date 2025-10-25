import { useParams, Link } from 'react-router-dom'

function BookDetail({ books }) {
  const { id } = useParams()
  const book = books.find(b => b.id === parseInt(id))

  if (!book) {
    return (
      <div style={{maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: 40, background: 'white'}}>
        <h2 style={{color: '#2c3e50'}}>Book Not Found</h2>
        <Link to="/" style={{
          display: 'inline-block',
          marginTop: 20,
          padding: '10px 20px',
          background: '#2c3e50',
          color: 'white',
          textDecoration: 'none',
        }}>← Back to Collection</Link>
      </div>
    )
  }

  return (
    <div style={{maxWidth: 900, margin: '0 auto'}}>
      <Link to="/" style={{
        display: 'inline-block',
        marginBottom: 20,
        padding: '8px 16px',
        background: '#2c3e50',
        color: 'white',
        textDecoration: 'none',
        fontSize: 14
      }}>← Back to Collection</Link>
      
      <div style={{
        background: 'white',
        padding: 40,
        border: '1px solid #ddd'
      }}>
        <div style={{borderBottom: '2px solid #2c3e50', paddingBottom: 20, marginBottom: 25}}>
          <h1 style={{margin: 0, marginBottom: 10, color: '#2c3e50', fontSize: 28, fontWeight: 600}}>{book.title}</h1>
          <p style={{margin: 0, color: '#e67e22', fontSize: 18, fontWeight: 500}}>by {book.author}</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, marginBottom: 30, padding: 20, background: '#f8f9fa'}}>
          <div>
            <div style={{fontSize: 12, color: '#7f8c8d', marginBottom: 5}}>Published</div>
            <div style={{fontSize: 16, color: '#2c3e50', fontWeight: 600}}>{book.year}</div>
          </div>
          <div>
            <div style={{fontSize: 12, color: '#7f8c8d', marginBottom: 5}}>Genre</div>
            <div style={{fontSize: 16, color: '#2c3e50', fontWeight: 600}}>{book.genre}</div>
          </div>
          <div>
            <div style={{fontSize: 12, color: '#7f8c8d', marginBottom: 5}}>Rating</div>
            <div style={{fontSize: 16, color: '#2c3e50', fontWeight: 600}}>⭐ {book.rating} / 5.0</div>
          </div>
        </div>

        <div>
          <h3 style={{color: '#2c3e50', fontSize: 18, marginBottom: 15}}>About this book</h3>
          <p style={{color: '#555', lineHeight: 1.8, fontSize: 15}}>{book.description}</p>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
