document.addEventListener('DOMContentLoaded', () => {
    const projectItems = document.querySelectorAll('.project-item');
    
    // Adiciona animação com delay para cada projeto
    projectItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, 300 * index);
    });
});

class Carousel {
    constructor(element) {
        this.carousel = element;
        this.container = element.querySelector('.carousel-container');
        this.slides = element.querySelectorAll('.carousel-slide');
        this.dotsContainer = element.querySelector('.carousel-dots');
        this.currentIndex = 0;
        
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        
        // Add button listeners
        element.querySelector('.prev').addEventListener('click', () => this.prev());
        element.querySelector('.next').addEventListener('click', () => this.next());
        
        // Initialize
        this.updateSlides();
    }
    
    updateSlides() {
        this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlides();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlides();
    }
}

// Lightbox functionality
class Lightbox {
    constructor() {
        this.createLightbox();
        this.initializeEventListeners();
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Lightbox image">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        this.lightbox = lightbox;
    }

    initializeEventListeners() {
        document.querySelectorAll('.carousel-slide').forEach(img => {
            img.addEventListener('click', () => this.open(img.src));
        });

        this.lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox') || 
                e.target.classList.contains('lightbox-close')) {
                this.close();
            }
        });
    }

    open(imageSrc) {
        this.lightbox.querySelector('img').src = imageSrc;
        this.lightbox.classList.add('active');
    }

    close() {
        this.lightbox.classList.remove('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));
    new Lightbox();
});
