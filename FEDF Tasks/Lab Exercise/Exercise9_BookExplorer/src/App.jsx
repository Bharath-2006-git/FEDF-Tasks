import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'

function App() {
  const [books] = useState([
    { id: 1, title: 'The God of Small Things', author: 'Arundhati Roy', description: 'A story about the childhood experiences of fraternal twins whose lives are destroyed by the "Love Laws" that lay down who should be loved, and how.', rating: 4.3, year: 1997, genre: 'Fiction' },
    { id: 2, title: 'Midnight\'s Children', author: 'Salman Rushdie', description: 'A magical realist epic about children born at the stroke of midnight on India\'s independence, gifted with extraordinary powers.', rating: 4.1, year: 1981, genre: 'Fiction' },
    { id: 3, title: 'The White Tiger', author: 'Aravind Adiga', description: 'A darkly humorous perspective of India\'s class struggle told through the eyes of a servant rising to success.', rating: 3.9, year: 2008, genre: 'Fiction' },
    { id: 4, title: 'Train to Pakistan', author: 'Khushwant Singh', description: 'A historical novel about the partition of India in 1947 and its impact on a small village.', rating: 4.2, year: 1956, genre: 'Historical Fiction' },
    { id: 5, title: 'The Namesake', author: 'Jhumpa Lahiri', description: 'A story spanning three decades about the Ganguli family and their struggle with identity and belonging.', rating: 4.0, year: 2003, genre: 'Fiction' },
    { id: 6, title: 'A Suitable Boy', author: 'Vikram Seth', description: 'An epic tale set in post-independence India following four families through love, politics, and social change.', rating: 4.1, year: 1993, genre: 'Romance' }
  ])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px 20px 40px'
    }}>
      <header style={{
        maxWidth: 1000,
        margin: '0 auto 30px',
        padding: '30px 20px',
        background: 'white',
        borderBottom: '3px solid #2c3e50'
      }}>
        <h1 style={{margin: 0, color: '#2c3e50', fontSize: 32, fontWeight: 600}}>
          <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>📚 Indian Literature Collection</Link>
        </h1>
        <p style={{margin: '10px 0 0', color: '#7f8c8d', fontSize: 15}}>Explore masterpieces from renowned Indian authors</p>
      </header>
      
      <Routes>
        <Route path="/" element={<BookList books={books} />} />
        <Route path="/book/:id" element={<BookDetail books={books} />} />
      </Routes>
    </div>
  )
}

export default App
