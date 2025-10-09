// Featured Product Slideshow with CSS Transitions
let slideIndex = 0;

// Start slideshow when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSlideshow();
    showSlides();
});

function initializeSlideshow() {
    const slides = document.getElementsByClassName("slide");
    // Show first slide initially
    if (slides.length > 0) {
        slides[0].classList.add("active");
    }
}

function showSlides() {
    const slides = document.getElementsByClassName("slide");
    
    // Remove active class from all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    // Move to next slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    // Add active class to current slide for CSS transition
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add("active");
    }
    
    // Update indicators
    updateIndicators();
    
    // Change slide every 4 seconds
    setTimeout(showSlides, 4000);
}

// Update slideshow indicators
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === slideIndex - 1) {
            indicator.classList.add('active');
        }
    });
}

// Add click functionality to indicators
document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        slideIndex = index + 1;
        const slides = document.getElementsByClassName("slide");
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove("active");
        }
        slides[slideIndex - 1].classList.add("active");
        updateIndicators();
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button functionality
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Loading animation
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
});
