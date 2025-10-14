// cartManager.js - Module for managing shopping cart functionality
// ES6 Module for cart operations, storage, and calculations

// Cart storage key for localStorage
const CART_STORAGE_KEY = 'bookstore_cart';

/**
 * Shopping Cart Class
 * Manages cart items, calculations, and persistence
 */
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    /**
     * Adds a book to the cart
     * @param {Object} book - Book object to add
     * @returns {boolean} Success status
     */
    addItem(book) {
        if (!book || !book.id) {
            console.error('Invalid book object provided');
            return false;
        }

        // Check if book is already in cart
        const existingItem = this.items.find(item => item.id === book.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                quantity: 1
            });
        }

        this.saveToStorage();
        this.notifyCartUpdate();
        return true;
    }

    /**
     * Removes an item from the cart by book ID
     * @param {number|string} bookId - ID of book to remove
     * @returns {boolean} Success status
     */
    removeItem(bookId) {
        const index = this.items.findIndex(item => item.id === parseInt(bookId));
        
        if (index === -1) {
            console.error('Item not found in cart');
            return false;
        }

        this.items.splice(index, 1);
        this.saveToStorage();
        this.notifyCartUpdate();
        return true;
    }

    /**
     * Updates quantity of an item in the cart
     * @param {number|string} bookId - ID of book to update
     * @param {number} quantity - New quantity (if 0, removes item)
     * @returns {boolean} Success status
     */
    updateQuantity(bookId, quantity) {
        if (quantity < 0) {
            console.error('Quantity cannot be negative');
            return false;
        }

        if (quantity === 0) {
            return this.removeItem(bookId);
        }

        const item = this.items.find(item => item.id === parseInt(bookId));
        
        if (!item) {
            console.error('Item not found in cart');
            return false;
        }

        item.quantity = quantity;
        this.saveToStorage();
        this.notifyCartUpdate();
        return true;
    }

    /**
     * Clears all items from the cart
     */
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.notifyCartUpdate();
    }

    /**
     * Gets all items in the cart
     * @returns {Array} Array of cart items
     */
    getItems() {
        return [...this.items]; // Return a copy to prevent external modifications
    }

    /**
     * Gets the total number of items in the cart
     * @returns {number} Total quantity of all items
     */
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Calculates the total price of all items in the cart
     * @returns {number} Total price
     */
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Checks if a book is in the cart
     * @param {number|string} bookId - ID of book to check
     * @returns {boolean} True if book is in cart
     */
    hasItem(bookId) {
        return this.items.some(item => item.id === parseInt(bookId));
    }

    /**
     * Gets a specific item from the cart
     * @param {number|string} bookId - ID of book to get
     * @returns {Object|null} Cart item or null if not found
     */
    getItem(bookId) {
        return this.items.find(item => item.id === parseInt(bookId)) || null;
    }

    /**
     * Saves cart data to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    /**
     * Loads cart data from localStorage
     */
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                this.items = JSON.parse(savedCart);
                // Validate loaded data
                this.items = this.items.filter(item => 
                    item && 
                    typeof item.id === 'number' && 
                    typeof item.price === 'number' && 
                    typeof item.quantity === 'number'
                );
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.items = [];
        }
    }

    /**
     * Dispatches a custom event when cart is updated
     */
    notifyCartUpdate() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                items: this.getItems(),
                itemCount: this.getItemCount(),
                totalPrice: this.getTotalPrice()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Gets cart summary for checkout
     * @returns {Object} Cart summary object
     */
    getCartSummary() {
        return {
            items: this.getItems(),
            itemCount: this.getItemCount(),
            totalPrice: this.getTotalPrice(),
            isEmpty: this.items.length === 0
        };
    }
}

// Create and export a singleton cart instance
export const cart = new ShoppingCart();

/**
 * Exported cart management functions for use by other modules
 */

/**
 * Adds a book to the cart
 * @param {Object} book - Book object to add
 * @returns {boolean} Success status
 */
export function addToCart(book) {
    return cart.addItem(book);
}

/**
 * Removes a book from the cart
 * @param {number|string} bookId - ID of book to remove
 * @returns {boolean} Success status
 */
export function removeFromCart(bookId) {
    return cart.removeItem(bookId);
}

/**
 * Updates quantity of a book in the cart
 * @param {number|string} bookId - ID of book to update
 * @param {number} quantity - New quantity
 * @returns {boolean} Success status
 */
export function updateCartQuantity(bookId, quantity) {
    return cart.updateQuantity(bookId, quantity);
}

/**
 * Clears the entire cart
 */
export function clearCart() {
    cart.clearCart();
}

/**
 * Gets all cart items
 * @returns {Array} Array of cart items
 */
export function getCartItems() {
    return cart.getItems();
}

/**
 * Gets total number of items in cart
 * @returns {number} Total item count
 */
export function getCartItemCount() {
    return cart.getItemCount();
}

/**
 * Gets total price of all items in cart
 * @returns {number} Total price
 */
export function getCartTotal() {
    return cart.getTotalPrice();
}

/**
 * Checks if a book is in the cart
 * @param {number|string} bookId - ID of book to check
 * @returns {boolean} True if book is in cart
 */
export function isInCart(bookId) {
    return cart.hasItem(bookId);
}

/**
 * Gets cart summary
 * @returns {Object} Cart summary object
 */
export function getCartSummary() {
    return cart.getCartSummary();
}

/**
 * Validates cart items against available books
 * @param {Array} availableBooks - Array of available book objects
 * @returns {Array} Array of invalid item IDs
 */
export function validateCartItems(availableBooks) {
    if (!availableBooks || !Array.isArray(availableBooks)) {
        return [];
    }

    const availableBookIds = new Set(availableBooks.map(book => book.id));
    const invalidItems = [];

    cart.items.forEach(item => {
        if (!availableBookIds.has(item.id)) {
            invalidItems.push(item.id);
        }
    });

    return invalidItems;
}

/**
 * Removes invalid items from cart
 * @param {Array} invalidItemIds - Array of invalid item IDs
 */
export function removeInvalidItems(invalidItemIds) {
    if (!invalidItemIds || !Array.isArray(invalidItemIds)) {
        return;
    }

    invalidItemIds.forEach(itemId => {
        cart.removeItem(itemId);
    });
}

/**
 * Formats price for display
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
        return '$0.00';
    }
    return `$${price.toFixed(2)}`;
}

/**
 * Calculates discount (future feature)
 * @param {number} total - Total amount
 * @param {number} discountPercent - Discount percentage
 * @returns {Object} Discount calculation result
 */
export function calculateDiscount(total, discountPercent = 0) {
    if (typeof total !== 'number' || typeof discountPercent !== 'number') {
        return { original: 0, discount: 0, final: 0 };
    }

    const discountAmount = (total * discountPercent) / 100;
    const finalAmount = total - discountAmount;

    return {
        original: total,
        discount: discountAmount,
        final: Math.max(0, finalAmount)
    };
}

/**
 * Initializes the cart manager
 * @returns {Object} Cart instance and methods
 */
export function initializeCartManager() {
    // Initialize cart and load any saved data
    cart.loadFromStorage();
    
    // Return public interface
    return {
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartItems,
        getCartItemCount,
        getCartTotal,
        isInCart,
        getCartSummary,
        validateCartItems,
        removeInvalidItems,
        formatPrice
    };
}