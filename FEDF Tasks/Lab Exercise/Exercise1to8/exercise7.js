
const booksData = [
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
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 11.75,
        availability: "in-stock"
    },
    {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        price: 15.99,
        availability: "in-stock"
    },
    {
        id: 6,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        price: 18.99,
        availability: "in-stock"
    },
    {
        id: 7,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        price: 25.50,
        availability: "out-of-stock"
    },
    {
        id: 8,
        title: "The Hunger Games",
        author: "Suzanne Collins",
        price: 16.25,
        availability: "in-stock"
    }
];

// Global variables
let cart = [];
let currentBooks = booksData;
let isCartVisible = false;

// DOM Elements
let elements = {};

// Cart Management Functions
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('bookstore_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem('bookstore_cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function addToCart(book) {
    if (book.availability !== 'in-stock') {
        showMessage('This book is out of stock!', 'error');
        return false;
    }

    const existingItem = cart.find(item => item.id === book.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    showMessage(`"${book.title}" added to cart!`, 'success');
    return true;
}

function removeFromCart(bookId) {
    const index = cart.findIndex(item => item.id === parseInt(bookId));
    if (index !== -1) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartDisplay();
        showMessage('Item removed from cart', 'info');
        return true;
    }
    return false;
}

function clearCart() {
    if (cart.length === 0) {
        showMessage('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        showMessage('Cart cleared', 'info');
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Book Display Functions
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = `book-card ${book.availability === 'out-of-stock' ? 'out-of-stock' : ''}`;
    
    const availabilityClass = book.availability === 'in-stock' ? 'in-stock' : 'out-of-stock';
    const availabilityText = book.availability === 'in-stock' ? 'In Stock' : 'Out of Stock';
    const buttonDisabled = book.availability === 'out-of-stock' ? 'disabled' : '';
    const buttonText = book.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart';

    bookCard.innerHTML = `
        <div class="book-title">${book.title}</div>
        <div class="book-author">by ${book.author}</div>
        <div class="book-price">$${book.price.toFixed(2)}</div>
        <div class="book-availability ${availabilityClass}">${availabilityText}</div>
        <button class="btn-primary" onclick="handleAddToCart(${book.id})" ${buttonDisabled}>
            ${buttonText}
        </button>
    `;

    return bookCard;
}

function renderBooks(books) {
    const container = elements.booksContainer;
    container.innerHTML = '';

    if (!books || books.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No books found</h3></div>';
        return;
    }

    books.forEach(book => {
        const bookCard = createBookCard(book);
        container.appendChild(bookCard);
    });
}

function filterBooks(filterValue) {
    let filteredBooks = currentBooks;
    
    if (filterValue === 'in-stock') {
        filteredBooks = currentBooks.filter(book => book.availability === 'in-stock');
    } else if (filterValue === 'out-of-stock') {
        filteredBooks = currentBooks.filter(book => book.availability === 'out-of-stock');
    }
    
    renderBooks(filteredBooks);
}

// UI Functions
function updateCartDisplay() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

function updateCartCount() {
    elements.cartCount.textContent = getCartItemCount();
    elements.cartCount.style.display = getCartItemCount() > 0 ? 'inline-block' : 'none';
}

function updateCartItems() {
    const container = elements.cartItems;
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><p>Add some books to get started!</p></div>';
        elements.checkoutBtn.disabled = true;
        return;
    }
    
    elements.checkoutBtn.disabled = false;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-author">by ${item.author}</div>
                <div>Quantity: ${item.quantity}</div>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        container.appendChild(cartItem);
    });
}

function updateCartTotal() {
    elements.cartTotal.textContent = getCartTotal().toFixed(2);
}

function toggleCart() {
    isCartVisible = !isCartVisible;
    
    if (isCartVisible) {
        elements.cartSection.classList.remove('hidden');
        elements.booksSection.style.display = 'none';
        elements.toggleCartBtn.textContent = '📖 Books';
        updateCartDisplay();
    } else {
        elements.cartSection.classList.add('hidden');
        elements.booksSection.style.display = 'block';
        elements.toggleCartBtn.textContent = '🛒 Cart';
    }
}

function showMessage(message, type = 'info') {
    // Remove existing message
    const existing = document.querySelector('.message');
    if (existing) existing.remove();
    
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 10px 15px;
        color: white; border-radius: 5px; z-index: 1001; font-weight: bold;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
    
    document.body.appendChild(messageEl);
    setTimeout(() => messageEl.remove(), 3000);
}

function showCheckoutModal() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    const modal = elements.checkoutModal;
    const itemsContainer = elements.checkoutItems;
    
    itemsContainer.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
        itemsContainer.appendChild(div);
    });
    
    elements.checkoutTotal.textContent = getCartTotal().toFixed(2);
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function hideCheckoutModal() {
    elements.checkoutModal.classList.add('hidden');
    elements.checkoutModal.classList.remove('show');
}

function completePurchase() {
    clearCart();
    hideCheckoutModal();
    showMessage('Thank you for your purchase!', 'success');
    if (isCartVisible) toggleCart();
}

// Event Handlers
function handleAddToCart(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (book) {
        addToCart(book);
    }
}

function handleFilterChange() {
    const filterValue = elements.filterSelect.value;
    filterBooks(filterValue);
}

// Initialize DOM Elements
function initializeElements() {
    elements = {
        cartCount: document.getElementById('cart-count'),
        toggleCartBtn: document.getElementById('toggle-cart'),
        booksSection: document.getElementById('books-section'),
        cartSection: document.getElementById('cart-section'),
        booksContainer: document.getElementById('books-container'),
        cartItems: document.getElementById('cart-items'),
        cartTotal: document.getElementById('cart-total'),
        clearCartBtn: document.getElementById('clear-cart'),
        checkoutBtn: document.getElementById('checkout'),
        checkoutModal: document.getElementById('checkout-modal'),
        checkoutItems: document.getElementById('checkout-items'),
        checkoutTotal: document.getElementById('checkout-total'),
        completePurchaseBtn: document.getElementById('complete-purchase'),
        closeModal: document.querySelector('.close'),
        filterSelect: document.getElementById('filter-availability')
    };
}

// Setup Event Listeners
function setupEventListeners() {
    elements.toggleCartBtn.addEventListener('click', toggleCart);
    elements.clearCartBtn.addEventListener('click', clearCart);
    elements.checkoutBtn.addEventListener('click', showCheckoutModal);
    elements.completePurchaseBtn.addEventListener('click', completePurchase);
    elements.closeModal.addEventListener('click', hideCheckoutModal);
    elements.filterSelect.addEventListener('change', handleFilterChange);
    
    // Close modal when clicking outside
    elements.checkoutModal.addEventListener('click', (e) => {
        if (e.target === elements.checkoutModal) {
            hideCheckoutModal();
        }
    });
}

// Initialize Application
function initializeApp() {
    console.log('📚 Initializing Online Bookstore...');
    
    initializeElements();
    setupEventListeners();
    loadCartFromStorage();
    renderBooks(currentBooks);
    updateCartDisplay();
    
    showMessage('Welcome to the Online Bookstore! 📚', 'success');
    console.log('✨ Application initialized successfully!');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);