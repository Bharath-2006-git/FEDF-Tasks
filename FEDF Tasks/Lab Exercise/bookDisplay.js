// bookDisplay.js - Module for displaying book listings
// ES6 Module for handling book data and display functionality

/**
 * Loads book data from JSON file
 * @returns {Promise<Array>} Array of book objects
 */
export async function loadBooks() {
    try {
        const response = await fetch('./books.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.books;
    } catch (error) {
        console.error('Error loading books:', error);
        // Return fallback data if JSON loading fails
        return getFallbackBooks();
    }
}

/**
 * Fallback book data in case JSON file is not accessible
 * @returns {Array} Array of book objects
 */
function getFallbackBooks() {
    return [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 12.99,
            availability: "in-stock"
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 14.50,
            availability: "in-stock"
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            price: 13.25,
            availability: "out-of-stock"
        }
    ];
}

/**
 * Renders a single book card
 * @param {Object} book - Book object with title, author, price, availability
 * @returns {HTMLElement} Book card element
 */
export function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = `book-card ${book.availability === 'out-of-stock' ? 'out-of-stock' : ''}`;
    bookCard.dataset.bookId = book.id;
    bookCard.dataset.availability = book.availability;

    const availabilityClass = book.availability === 'in-stock' ? 'in-stock' : 'out-of-stock';
    const availabilityText = book.availability === 'in-stock' ? 'In Stock' : 'Out of Stock';
    const buttonDisabled = book.availability === 'out-of-stock' ? 'disabled' : '';
    const buttonText = book.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart';

    bookCard.innerHTML = `
        <div class="book-title">${escapeHtml(book.title)}</div>
        <div class="book-author">by ${escapeHtml(book.author)}</div>
        <div class="book-price">$${book.price.toFixed(2)}</div>
        <div class="book-availability ${availabilityClass}">${availabilityText}</div>
        <button class="btn-primary add-to-cart-btn" 
                data-book-id="${book.id}" 
                ${buttonDisabled}>
            ${buttonText}
        </button>
    `;

    return bookCard;
}

/**
 * Renders all books to the container
 * @param {Array} books - Array of book objects
 * @param {HTMLElement} container - Container element to render books into
 */
export function renderBooks(books, container) {
    if (!container) {
        console.error('Container element not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    if (!books || books.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No books available</h3>
                <p>Please check back later for new arrivals.</p>
            </div>
        `;
        return;
    }

    // Create and append book cards
    books.forEach(book => {
        const bookCard = createBookCard(book);
        container.appendChild(bookCard);
    });
}

/**
 * Filters books based on availability
 * @param {Array} books - Array of all books
 * @param {string} filter - Filter criteria ('all', 'in-stock', 'out-of-stock')
 * @returns {Array} Filtered array of books
 */
export function filterBooks(books, filter) {
    if (!books || !Array.isArray(books)) {
        return [];
    }

    switch (filter) {
        case 'in-stock':
            return books.filter(book => book.availability === 'in-stock');
        case 'out-of-stock':
            return books.filter(book => book.availability === 'out-of-stock');
        case 'all':
        default:
            return books;
    }
}

/**
 * Sets up filter functionality
 * @param {Array} books - Array of all books
 * @param {HTMLElement} container - Container to render filtered books
 */
export function setupBookFilter(books, container) {
    const filterSelect = document.getElementById('filter-availability');
    
    if (!filterSelect) {
        console.error('Filter select element not found');
        return;
    }

    filterSelect.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        const filteredBooks = filterBooks(books, filterValue);
        renderBooks(filteredBooks, container);
        
        // Dispatch custom event for other modules to listen
        document.dispatchEvent(new CustomEvent('booksFiltered', {
            detail: { books: filteredBooks, filter: filterValue }
        }));
    });
}

/**
 * Finds a book by ID
 * @param {Array} books - Array of books to search in
 * @param {number|string} bookId - ID of the book to find
 * @returns {Object|null} Book object or null if not found
 */
export function findBookById(books, bookId) {
    if (!books || !Array.isArray(books)) {
        return null;
    }
    
    return books.find(book => book.id === parseInt(bookId)) || null;
}

/**
 * Utility function to escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initializes the book display module
 * @param {HTMLElement} container - Container element for books
 * @returns {Promise<Array>} Promise resolving to loaded books
 */
export async function initializeBookDisplay(container) {
    if (!container) {
        throw new Error('Container element is required for book display initialization');
    }

    // Show loading state
    container.innerHTML = '<div class="loading">Loading books...</div>';

    try {
        // Load books from JSON
        const books = await loadBooks();
        
        // Render all books initially
        renderBooks(books, container);
        
        // Setup filter functionality
        setupBookFilter(books, container);
        
        return books;
    } catch (error) {
        console.error('Error initializing book display:', error);
        container.innerHTML = `
            <div class="empty-state">
                <h3>Error loading books</h3>
                <p>Please refresh the page to try again.</p>
            </div>
        `;
        throw error;
    }
}