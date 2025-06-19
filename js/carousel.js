class Carousel {
    constructor(element) {
        this.carousel = element;
        this.slides = element.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;

        // Add button listeners
        element.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        element.querySelector('.next').addEventListener('click', () => this.nextSlide());

        // Create dots
        const dotsContainer = element.querySelector('.carousel-dots');
        this.dots = Array.from(this.slides).map((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
            return dot;
        });

        // Add click handler for images
        this.slides.forEach(slide => {
            slide.addEventListener('click', () => {
                const allImages = Array.from(this.slides).map(img => img.src);
                const currentIndex = Array.from(this.slides).indexOf(slide);
                window.imageViewer.open(allImages, currentIndex);
            });
        });

        // Initialize
        this.updateSlide();
    }

    updateSlide() {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.zIndex = '0';
            slide.classList.remove('active');
        });

        // Show current slide
        const currentSlide = this.slides[this.currentSlide];
        currentSlide.style.opacity = '1';
        currentSlide.style.zIndex = '1';
        currentSlide.classList.add('active');

        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlide();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
}

// Initialize all carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => new Carousel(carousel));
});
