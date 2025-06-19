console.log('ImageViewer loaded'); // Teste de carregamento

class ImageViewer {
    constructor() {
        console.log('ImageViewer initialized'); // Teste de inicialização
        this.createViewer();
        this.bindEvents();
        this.isAnimating = false;
    }

    createViewer() {
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer';
        viewer.innerHTML = `
            <div class="viewer-content">
                <img src="" alt="Enlarged image" class="viewer-image">
                <button class="viewer-close">
                    <i class="fas fa-times"></i>
                </button>
                <button class="viewer-nav prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="viewer-nav next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="viewer-dots"></div>
            </div>
        `;
        document.body.appendChild(viewer);
        
        this.container = viewer;
        this.img = viewer.querySelector('img');
        this.dotsContainer = viewer.querySelector('.viewer-dots');
    }

    bindEvents() {
        this.container.querySelector('.viewer-close').addEventListener('click', () => this.close());
        this.container.querySelector('.prev').addEventListener('click', () => this.prev());
        this.container.querySelector('.next').addEventListener('click', () => this.next());
        
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.container.classList.contains('active')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    open(images, startIndex = 0) {
        this.images = images;
        this.currentIndex = startIndex;
        this.container.classList.add('active');
        this.updateImage();
        this.updateDots();
    }

    close() {
        this.container.classList.remove('active');
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    updateDots() {
        this.dotsContainer.innerHTML = '';
        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `viewer-dot ${index === this.currentIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    goToSlide(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.img.style.opacity = '0';
        setTimeout(() => {
            this.currentIndex = index;
            this.updateImage();
            this.img.style.opacity = '1';
            this.isAnimating = false;
        }, 300);
        
        this.updateDots();
    }

    updateImage() {
        this.img.style.opacity = '0';
        setTimeout(() => {
            this.img.src = this.images[this.currentIndex];
            this.img.onload = () => {
                this.img.style.opacity = '1';
                this.container.style.display = 'flex';
                this.container.style.alignItems = 'center';
                this.container.style.justifyContent = 'center';
            };
        }, 300);
        this.updateDots();
    }
}

// Create global instance
window.imageViewer = new ImageViewer();

// Add click event to project images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card .project-image').forEach(projectImage => {
        const img = projectImage.querySelector('img');
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', () => {
            const imagesData = projectImage.dataset.images;
            const projectImages = JSON.parse(imagesData);
            
            if (projectImages && projectImages.length > 0) {
                console.log('Opening images:', projectImages); // Debug
                imageViewer.open(projectImages);
            } else {
                console.error('No images found in data-images attribute');
            }
        });
    });
});
