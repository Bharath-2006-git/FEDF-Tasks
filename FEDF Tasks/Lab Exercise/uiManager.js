// uiManager.js - Module for managing UI updates and user interactions
// ES6 Module for dynamic UI updates and event handling

import { addToCart, removeFromCart, clearCart, getCartItems, getCartItemCount, getCartTotal, formatPrice } from './cartManager.js';

/**
 * UI Manager Class
 * Handles all UI updates and user interactions
 */
class UIManager {
    constructor() {
        this.elements = {};
        this.isCartVisible = false;
        this.currentBooks = [];
        this.initializeElements();
        this.setupEventListeners();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.elements = {
            cartCount: document.getElementById('cart-count'),
            toggleCartBtn: document.getElementById('toggle-cart'),
            booksSection: document.getElementById('books-section'),
            cartSection: document.getElementById('cart-section'),
            cartContainer: document.getElementById('cart-container'),
            cartItems: document.getElementById('cart-items'),
            cartTotal: document.getElementById('cart-total'),
            clearCartBtn: document.getElementById('clear-cart'),
            checkoutBtn: document.getElementById('checkout'),
            checkoutModal: document.getElementById('checkout-modal'),
            checkoutItems: document.getElementById('checkout-items'),
            checkoutTotal: document.getElementById('checkout-total'),
            completePurchaseBtn: document.getElementById('complete-purchase'),
            closeModal: document.querySelector('.close'),
            booksContainer: document.getElementById('books-container')
        };

        // Validate that all required elements exist
        const missingElements = Object.entries(this.elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.warn('Missing UI elements:', missingElements);
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Cart toggle button
        if (this.elements.toggleCartBtn) {
            this.elements.toggleCartBtn.addEventListener('click', () => this.toggleCart());
        }

        // Clear cart button
        if (this.elements.clearCartBtn) {
            this.elements.clearCartBtn.addEventListener('click', () => this.handleClearCart());
        }

        // Checkout button
        if (this.elements.checkoutBtn) {
            this.elements.checkoutBtn.addEventListener('click', () => this.showCheckoutModal());
        }

        // Complete purchase button
        if (this.elements.completePurchaseBtn) {
            this.elements.completePurchaseBtn.addEventListener('click', () => this.completePurchase());
        }

        // Modal close button
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => this.hideCheckoutModal());
        }

        // Close modal when clicking outside
        if (this.elements.checkoutModal) {
            this.elements.checkoutModal.addEventListener('click', (e) => {
                if (e.target === this.elements.checkoutModal) {
                    this.hideCheckoutModal();
                }
            });
        }

        // Listen for cart updates
        document.addEventListener('cartUpdated', (e) => this.handleCartUpdate(e.detail));

        // Listen for add to cart button clicks (delegated event handling)
        if (this.elements.booksContainer) {
            this.elements.booksContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    this.handleAddToCart(e);
                }
            });
        }

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.checkoutModal && !this.elements.checkoutModal.classList.contains('hidden')) {
                this.hideCheckoutModal();
            }
        });
    }

    /**
     * Sets the current books array for reference
     * @param {Array} books - Array of book objects
     */
    setBooks(books) {
        this.currentBooks = books || [];
    }

    /**
     * Toggles the cart visibility
     */
    toggleCart() {
        this.isCartVisible = !this.isCartVisible;
        
        if (this.isCartVisible) {
            this.showCart();
        } else {
            this.hideCart();
        }
    }

    /**
     * Shows the cart section
     */
    showCart() {
        if (this.elements.cartSection) {
            this.elements.cartSection.classList.remove('hidden');
            this.elements.booksSection.style.display = 'none';
            this.elements.toggleCartBtn.textContent = '📖 Books';
            this.isCartVisible = true;
            this.updateCartDisplay();
        }
    }

    /**
     * Hides the cart section
     */
    hideCart() {
        if (this.elements.cartSection) {
            this.elements.cartSection.classList.add('hidden');
            this.elements.booksSection.style.display = 'block';
            this.elements.toggleCartBtn.textContent = '🛒 Cart';
            this.isCartVisible = false;
        }
    }

    /**
     * Updates the cart count badge
     */
    updateCartCount() {
        if (this.elements.cartCount) {
            const count = getCartItemCount();
            this.elements.cartCount.textContent = count;
            this.elements.cartCount.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    /**
     * Updates the cart total display
     */
    updateCartTotal() {
        if (this.elements.cartTotal) {
            const total = getCartTotal();
            this.elements.cartTotal.textContent = total.toFixed(2);
        }
    }

    /**
     * Updates the complete cart display
     */
    updateCartDisplay() {
        const cartItems = getCartItems();
        
        if (!this.elements.cartItems) {
            return;
        }

        // Clear existing cart items
        this.elements.cartItems.innerHTML = '';

        if (cartItems.length === 0) {
            this.elements.cartItems.innerHTML = `
                <div class="empty-state">
                    <h3>Your cart is empty</h3>
                    <p>Add some books to get started!</p>
                </div>
            `;
            
            // Disable checkout button
            if (this.elements.checkoutBtn) {
                this.elements.checkoutBtn.disabled = true;
            }
            return;
        }

        // Enable checkout button
        if (this.elements.checkoutBtn) {
            this.elements.checkoutBtn.disabled = false;
        }

        // Render cart items
        cartItems.forEach(item => {
            const cartItem = this.createCartItemElement(item);
            this.elements.cartItems.appendChild(cartItem);
        });

        this.updateCartTotal();
    }

    /**
     * Creates a cart item element
     * @param {Object} item - Cart item object
     * @returns {HTMLElement} Cart item element
     */
    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.bookId = item.id;

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${this.escapeHtml(item.title)}</div>
                <div class="cart-item-author">by ${this.escapeHtml(item.author)}</div>
                <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
            <button class="remove-btn" data-book-id="${item.id}">Remove</button>
        `;

        // Add event listener for remove button
        const removeBtn = cartItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => this.handleRemoveFromCart(item.id));

        return cartItem;
    }

    /**
     * Handles adding a book to cart
     * @param {Event} event - Click event
     */
    handleAddToCart(event) {
        const bookId = parseInt(event.target.dataset.bookId);
        const book = this.currentBooks.find(b => b.id === bookId);
        
        if (!book) {
            this.showMessage('Book not found!', 'error');
            return;
        }

        if (book.availability !== 'in-stock') {
            this.showMessage('This book is currently out of stock.', 'error');
            return;
        }

        const success = addToCart(book);
        if (success) {
            this.showMessage(`"${book.title}" added to cart!`, 'success');
            // Update button text temporarily
            event.target.textContent = 'Added!';
            setTimeout(() => {
                event.target.textContent = 'Add to Cart';
            }, 1000);
        } else {
            this.showMessage('Failed to add book to cart.', 'error');
        }
    }

    /**
     * Handles removing a book from cart
     * @param {number|string} bookId - ID of book to remove
     */
    handleRemoveFromCart(bookId) {
        const success = removeFromCart(bookId);
        if (success) {
            this.showMessage('Item removed from cart.', 'info');
        } else {
            this.showMessage('Failed to remove item.', 'error');
        }
    }

    /**
     * Handles clearing the entire cart
     */
    handleClearCart() {
        if (getCartItemCount() === 0) {
            this.showMessage('Cart is already empty.', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear your cart?')) {
            clearCart();
            this.showMessage('Cart cleared.', 'info');
        }
    }

    /**
     * Handles cart update events
     * @param {Object} cartData - Cart update data
     */
    handleCartUpdate(cartData) {
        this.updateCartCount();
        if (this.isCartVisible) {
            this.updateCartDisplay();
        }
    }

    /**
     * Shows the checkout modal
     */
    showCheckoutModal() {
        const cartItems = getCartItems();
        
        if (cartItems.length === 0) {
            this.showMessage('Your cart is empty!', 'error');
            return;
        }

        if (!this.elements.checkoutModal || !this.elements.checkoutItems) {
            return;
        }

        // Populate checkout items
        this.elements.checkoutItems.innerHTML = '';
        cartItems.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <div>${this.escapeHtml(item.title)} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}</div>
            `;
            this.elements.checkoutItems.appendChild(checkoutItem);
        });

        // Update checkout total
        if (this.elements.checkoutTotal) {
            this.elements.checkoutTotal.textContent = getCartTotal().toFixed(2);
        }

        // Show modal
        this.elements.checkoutModal.classList.remove('hidden');
        this.elements.checkoutModal.classList.add('show');
    }

    /**
     * Hides the checkout modal
     */
    hideCheckoutModal() {
        if (this.elements.checkoutModal) {
            this.elements.checkoutModal.classList.add('hidden');
            this.elements.checkoutModal.classList.remove('show');
        }
    }

    /**
     * Completes the purchase
     */
    completePurchase() {
        // Clear the cart
        clearCart();
        
        // Hide modal
        this.hideCheckoutModal();
        
        // Show success message
        this.showMessage('Thank you for your purchase! This was a mock checkout.', 'success');
        
        // Hide cart and show books
        this.hideCart();
    }

    /**
     * Shows a temporary message to the user
     * @param {string} message - Message to show
     * @param {string} type - Message type ('success', 'error', 'info')
     */
    showMessage(message, type = 'info') {
        // Remove existing message if any
        const existingMessage = document.querySelector('.message-notification');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message-notification ${type}`;
        messageEl.textContent = message;
        
        // Add styles
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                messageEl.style.background = '#28a745';
                break;
            case 'error':
                messageEl.style.background = '#dc3545';
                break;
            case 'info':
            default:
                messageEl.style.background = '#17a2b8';
                break;
        }

        // Add to page
        document.body.appendChild(messageEl);

        // Remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    /**
     * Utility function to escape HTML
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
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
     * Updates UI based on screen size (responsive behavior)
     */
    updateResponsiveUI() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && this.isCartVisible) {
            // On mobile, ensure cart takes full attention
            if (this.elements.booksSection) {
                this.elements.booksSection.style.display = 'none';
            }
        }
    }

    /**
     * Initializes the UI Manager
     */
    initialize() {
        // Initial cart count update
        this.updateCartCount();
        
        // Setup responsive behavior
        window.addEventListener('resize', () => this.updateResponsiveUI());
        this.updateResponsiveUI();

        // Add CSS animations if not already present
        this.addAnimationStyles();
    }

    /**
     * Adds CSS animations dynamically
     */
    addAnimationStyles() {
        const styleId = 'ui-manager-animations';
        if (document.getElementById(styleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Create and export UI Manager instance
export const uiManager = new UIManager();

/**
 * Exported UI management functions
 */

/**
 * Initializes the UI Manager
 * @param {Array} books - Array of book objects for reference
 */
export function initializeUI(books) {
    uiManager.setBooks(books);
    uiManager.initialize();
    return uiManager;
}

/**
 * Updates the cart display
 */
export function updateCartDisplay() {
    uiManager.updateCartDisplay();
}

/**
 * Shows a message to the user
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'info')
 */
export function showMessage(message, type = 'info') {
    uiManager.showMessage(message, type);
}

/**
 * Toggles cart visibility
 */
export function toggleCartVisibility() {
    uiManager.toggleCart();
}

/**
 * Shows the cart
 */
export function showCart() {
    uiManager.showCart();
}

/**
 * Hides the cart
 */
export function hideCart() {
    uiManager.hideCart();
}