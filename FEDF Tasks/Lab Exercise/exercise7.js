// exercise7.js - Main application script
// Entry point that imports and orchestrates all modules for the Online Bookstore

import { initializeBookDisplay, loadBooks, findBookById } from './bookDisplay.js';
import { initializeCartManager, validateCartItems, removeInvalidItems } from './cartManager.js';
import { initializeUI, showMessage } from './uiManager.js';

/**
 * Main Application Class
 * Coordinates all modules and handles application lifecycle
 */
class BookstoreApp {
    constructor() {
        this.books = [];
        this.cartManager = null;
        this.uiManager = null;
        this.isInitialized = false;
    }

    /**
     * Initializes the entire application
     */
    async initialize() {
        try {
            console.log('🚀 Initializing Online Bookstore Application...');
            
            // Show loading state
            this.showLoadingState();

            // Initialize cart manager first
            console.log('📦 Initializing Cart Manager...');
            this.cartManager = initializeCartManager();

            // Load and display books
            console.log('📚 Loading books...');
            await this.initializeBooks();

            // Initialize UI Manager
            console.log('🎨 Initializing UI Manager...');
            this.uiManager = initializeUI(this.books);

            // Validate existing cart items against loaded books
            console.log('✅ Validating cart items...');
            this.validateAndCleanCart();

            // Setup additional event listeners
            this.setupApplicationEventListeners();

            // Hide loading state
            this.hideLoadingState();

            this.isInitialized = true;
            console.log('✨ Application initialized successfully!');
            
            // Show welcome message
            showMessage('Welcome to the Online Bookstore! 📚', 'success');

        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initializes the book display system
     */
    async initializeBooks() {
        try {
            // Get books container
            const booksContainer = document.getElementById('books-container');
            if (!booksContainer) {
                throw new Error('Books container element not found');
            }

            // Initialize book display and load books
            this.books = await initializeBookDisplay(booksContainer);
            
            console.log(`📖 Loaded ${this.books.length} books successfully`);
            
            // Log book availability summary
            const inStock = this.books.filter(book => book.availability === 'in-stock').length;
            const outOfStock = this.books.filter(book => book.availability === 'out-of-stock').length;
            console.log(`📊 Books in stock: ${inStock}, Out of stock: ${outOfStock}`);

        } catch (error) {
            console.error('Error loading books:', error);
            throw new Error('Failed to load book catalog');
        }
    }

    /**
     * Validates cart items and removes any invalid ones
     */
    validateAndCleanCart() {
        try {
            const invalidItems = validateCartItems(this.books);
            
            if (invalidItems.length > 0) {
                console.log('🧹 Cleaning invalid cart items:', invalidItems);
                removeInvalidItems(invalidItems);
                showMessage('Some items were removed from your cart as they are no longer available.', 'info');
            }
        } catch (error) {
            console.error('Error validating cart:', error);
        }
    }

    /**
     * Sets up application-wide event listeners
     */
    setupApplicationEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isInitialized) {
                // Refresh data when page becomes visible again
                this.handlePageVisible();
            }
        });

        // Handle window beforeunload to save any pending changes
        window.addEventListener('beforeunload', () => {
            this.handlePageUnload();
        });

        // Handle errors globally
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            this.handleGlobalError(event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason);
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            showMessage('Connection restored! 🌐', 'success');
        });

        window.addEventListener('offline', () => {
            showMessage('You are offline. Some features may not work. 📡', 'info');
        });

        // Custom application events
        document.addEventListener('bookAddedToCart', (event) => {
            this.handleBookAddedToCart(event.detail);
        });

        document.addEventListener('cartCleared', () => {
            this.handleCartCleared();
        });
    }

    /**
     * Shows loading state
     */
    showLoadingState() {
        const loadingHTML = `
            <div class="loading-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-size: 1.2rem;
                color: #667eea;
            ">
                <div>
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
                        <div>Loading Online Bookstore...</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }

    /**
     * Hides loading state
     */
    hideLoadingState() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    /**
     * Handles initialization errors
     * @param {Error} error - The error that occurred
     */
    handleInitializationError(error) {
        this.hideLoadingState();
        
        const errorMessage = `
            <div class="error-state" style="
                text-align: center;
                padding: 3rem;
                color: #dc3545;
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 10px;
                margin: 2rem;
            ">
                <h2>❌ Application Failed to Load</h2>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Please refresh the page to try again.</p>
                <button onclick="window.location.reload()" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-top: 1rem;
                ">
                    Reload Page
                </button>
            </div>
        `;

        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = errorMessage;
        } else {
            document.body.innerHTML = errorMessage;
        }
    }

    /**
     * Handles page becoming visible
     */
    handlePageVisible() {
        console.log('👁️ Page became visible, refreshing cart state...');
        // Could add logic here to refresh data or sync cart
    }

    /**
     * Handles page unload
     */
    handlePageUnload() {
        console.log('👋 Page unloading, saving any pending changes...');
        // Cart is automatically saved via localStorage in cartManager
    }

    /**
     * Handles global errors
     * @param {Error} error - The error that occurred
     */
    handleGlobalError(error) {
        if (this.isInitialized) {
            showMessage('An unexpected error occurred. Please try again.', 'error');
        }
    }

    /**
     * Handles book added to cart events
     * @param {Object} bookData - Data about the book added
     */
    handleBookAddedToCart(bookData) {
        console.log('📖➕ Book added to cart:', bookData);
        // Could add additional logic here like analytics tracking
    }

    /**
     * Handles cart cleared events
     */
    handleCartCleared() {
        console.log('🧹 Cart was cleared');
        // Could add additional logic here
    }

    /**
     * Gets application statistics
     * @returns {Object} Application stats
     */
    getAppStats() {
        if (!this.isInitialized) {
            return { error: 'Application not initialized' };
        }

        return {
            totalBooks: this.books.length,
            booksInStock: this.books.filter(book => book.availability === 'in-stock').length,
            booksOutOfStock: this.books.filter(book => book.availability === 'out-of-stock').length,
            cartItemCount: this.cartManager ? this.cartManager.getCartItemCount() : 0,
            cartTotal: this.cartManager ? this.cartManager.getCartTotal() : 0
        };
    }

    /**
     * Searches for books
     * @param {string} query - Search query
     * @returns {Array} Array of matching books
     */
    searchBooks(query) {
        if (!query || !this.books.length) {
            return this.books;
        }

        const searchTerm = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Gets a book by ID
     * @param {number|string} bookId - ID of the book
     * @returns {Object|null} Book object or null if not found
     */
    getBookById(bookId) {
        return findBookById(this.books, bookId);
    }

    /**
     * Refreshes the application data
     */
    async refresh() {
        try {
            console.log('🔄 Refreshing application data...');
            showMessage('Refreshing data...', 'info');
            
            await this.initializeBooks();
            this.validateAndCleanCart();
            
            showMessage('Data refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing data:', error);
            showMessage('Failed to refresh data.', 'error');
        }
    }

    /**
     * Exports cart data (for potential future features)
     * @returns {Object} Cart data
     */
    exportCartData() {
        if (!this.cartManager) {
            return null;
        }
        
        return {
            items: this.cartManager.getCartItems(),
            total: this.cartManager.getCartTotal(),
            itemCount: this.cartManager.getCartItemCount(),
            exportedAt: new Date().toISOString()
        };
    }
}

/**
 * Global application instance
 */
let appInstance = null;

/**
 * Initializes the application when DOM is ready
 */
async function initializeApp() {
    // Ensure DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
        return;
    }

    try {
        // Create and initialize app instance
        appInstance = new BookstoreApp();
        await appInstance.initialize();
        
        // Make app instance available globally for debugging
        window.bookstoreApp = appInstance;
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

/**
 * Exported functions for external access
 */
export { BookstoreApp, initializeApp };

/**
 * Auto-initialize when script loads
 */
console.log('📚 Online Bookstore - Exercise 7: Modular JavaScript and JSON');
console.log('🔧 Initializing application...');

// Start the application
initializeApp();

// Development utilities (available in browser console)
if (typeof window !== 'undefined') {
    window.bookstoreUtils = {
        getAppStats: () => appInstance ? appInstance.getAppStats() : null,
        searchBooks: (query) => appInstance ? appInstance.searchBooks(query) : [],
        refreshApp: () => appInstance ? appInstance.refresh() : null,
        exportCart: () => appInstance ? appInstance.exportCartData() : null,
        getBookById: (id) => appInstance ? appInstance.getBookById(id) : null
    };

    console.log('🔧 Development utilities available at window.bookstoreUtils');
    console.log('📊 Get app stats: bookstoreUtils.getAppStats()');
    console.log('🔍 Search books: bookstoreUtils.searchBooks("query")');
    console.log('🔄 Refresh app: bookstoreUtils.refreshApp()');
}