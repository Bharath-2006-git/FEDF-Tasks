# Exercise 9: Book Explorer with React Router and Props

## 📘 Overview
A single-page application (SPA) for browsing and exploring books. Built with React, React Router, and component-based architecture demonstrating dynamic routing, props management, and state handling.

## 🎯 Features Implemented

### ✅ Core Requirements
1. **React Router Setup**
   - `/` route for book list homepage
   - `/book/:id` route for individual book details
   - Dynamic routing with `useParams()` hook

2. **State Management**
   - Parent component (`App.jsx`) manages book data using `useState`
   - Data flows down through props to child components

3. **Component Architecture**
   - **BookCard**: Reusable component displaying book preview (title, author, genre, rating)
   - **BookDetail**: Comprehensive book view with full details
   - **BookList**: Container component managing the book grid

4. **Props Implementation**
   - Book data passed from parent to child components
   - Dynamic rendering based on prop values
   - Type-consistent prop usage throughout

5. **API Simulation**
   - `useEffect` hook simulates data fetching on mount
   - Loading state with spinner animation
   - 1-second delay to simulate network request

6. **User Experience**
   - Responsive design for all screen sizes
   - Smooth animations and transitions
   - Loading indicators
   - Error handling for invalid book IDs
   - Back navigation functionality

## 🗂️ Project Structure

```
Exercise9_BookExplorer/
├── src/
│   ├── components/
│   │   ├── BookList.jsx          # List view container
│   │   ├── BookList.css
│   │   ├── BookCard.jsx          # Individual book card
│   │   ├── BookCard.css
│   │   ├── BookDetail.jsx        # Detail view
│   │   └── BookDetail.css
│   ├── App.jsx                   # Main app with routing
│   ├── App.css
│   ├── main.jsx                  # Entry point with BrowserRouter
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd "d:\Study\Frontend Classes\FEDF Tasks\Lab Exercise\Exercise9_BookExplorer"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in terminal (typically `http://localhost:5173`)

## 📚 Book Data Structure

Each book contains:
- `id`: Unique identifier
- `title`: Book title
- `author`: Author name
- `description`: Detailed book description
- `rating`: Rating out of 5
- `genre`: Book category
- `publishedYear`: Publication year
- `pages`: Number of pages

## 🔧 Key React Concepts Demonstrated

### 1. React Router
```jsx
<Routes>
  <Route path="/" element={<BookList books={books} loading={loading} />} />
  <Route path="/book/:id" element={<BookDetail books={books} />} />
</Routes>
```

### 2. useParams Hook
```jsx
const { id } = useParams()
const book = books.find(b => b.id === parseInt(id))
```

### 3. Props Drilling
```jsx
// App.jsx passes data down
<BookList books={books} loading={loading} />

// BookList passes individual book to BookCard
<BookCard key={book.id} book={book} />
```

### 4. useState & useEffect
```jsx
const [books, setBooks] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  // Simulate API call
  setTimeout(() => {
    setBooks(bookData)
    setLoading(false)
  }, 1000)
}, [])
```

### 5. Conditional Rendering
```jsx
if (loading) {
  return <LoadingSpinner />
}

if (!book) {
  return <NotFound />
}
```

## 🎨 Styling Features

- **Gradient Background**: Purple gradient for modern look
- **Card Hover Effects**: Elevate cards on hover
- **Responsive Grid**: Auto-adjusting layout
- **Loading Animation**: Smooth spinner with fade-in
- **Button Transitions**: Smooth interactions
- **Mobile-First**: Optimized for all devices

## 📱 Responsive Breakpoints

- **Desktop**: 3-column grid (1400px+)
- **Tablet**: 2-column grid (768px - 1400px)
- **Mobile**: Single column (<768px)

## 🧪 Testing the Application

### Test Cases:
1. **Homepage Load**: Verify all 6 books display correctly
2. **Loading State**: Check spinner appears during initial load
3. **Card Click**: Click any book card to navigate to detail page
4. **URL Direct Access**: Try accessing `/book/1`, `/book/2`, etc.
5. **Invalid ID**: Test `/book/999` to see error handling
6. **Back Navigation**: Use back button to return to list
7. **Responsive**: Test on different screen sizes

## 🎓 Learning Outcomes

✅ Understanding SPA architecture  
✅ React Router implementation  
✅ Dynamic routing with parameters  
✅ Component composition and reusability  
✅ Props drilling and data flow  
✅ State management with hooks  
✅ Simulating async operations  
✅ Conditional rendering patterns  
✅ Navigation between routes  
✅ Error handling in React

## 📸 Screenshots

### Homepage (Book List)
Shows all books in a responsive grid with cards displaying:
- Book title and rating
- Author name
- Genre badge
- Publication year
- "View Details" button

### Detail Page
Displays comprehensive book information:
- Large title and rating badge
- Author, genre, publication year, page count
- Full description
- Action buttons (Add to Reading List, Mark as Read)
- Back navigation button

## 🔗 Navigation Flow

```
Homepage (/)
    ↓ (Click book card)
Detail Page (/book/:id)
    ↓ (Click back)
Homepage (/)
```

## 🛠️ Technologies Used

- **React 18.3.1**: UI library
- **React Router 6.22.0**: Client-side routing
- **Vite 5.3.1**: Build tool and dev server
- **CSS3**: Styling with modern features
- **ES6+**: Modern JavaScript

## 📝 Notes

- This is a client-side only application (no backend)
- Book data is hardcoded for demonstration purposes
- In production, you would fetch from a real API
- All routes work with browser back/forward buttons
- Direct URL access works for all routes

## 👨‍💻 Author

Exercise 9 - React Router & Props Implementation  
Frontend Development Course

## 📄 License

This project is for educational purposes as part of the Frontend Development course.
