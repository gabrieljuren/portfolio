// Smooth scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animação de fade-in para os cartões de projeto
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.project-card').forEach((card) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Adicionar efeitos aos cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Navegação
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

// Toggle menu mobile
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Efeito de scroll na navegação
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Highlight item ativo no menu
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Ajuste para compensar o header fixo
        const sectionHeight = section.clientHeight;
        const scrollY = window.scrollY;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // Caso especial para o topo da página
    if (window.scrollY < 100) {
        current = 'home';
    }

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// ImageViewer Implementation
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    let currentImages = [];
    let currentIndex = 0;
    let currentZoom = 1;

    // Adicionar evento de clique nas imagens
    document.querySelectorAll('.project-image').forEach(projectImage => {
        projectImage.addEventListener('click', () => {
            const imagesData = projectImage.dataset.images;
            if (imagesData) {
                currentImages = JSON.parse(imagesData);
                currentIndex = 0;
                openViewer();
            }
        });
    });

    function openViewer() {
        imageViewer.style.display = 'flex';
        // Força um reflow antes de adicionar a classe active
        imageViewer.offsetHeight;
        imageViewer.classList.add('active');
        updateImage();
    }

    function closeViewer() {
        imageViewer.classList.remove('active');
        setTimeout(() => {
            imageViewer.style.display = 'none';
        }, 300);
    }

    function updateImage() {
        viewerImage.style.opacity = '0';
        setTimeout(() => {
            viewerImage.src = currentImages[currentIndex];
            viewerImage.style.opacity = '1';
        }, 150);
    }

    // Navegação
    document.querySelector('.viewer-nav.prev').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateImage();
    });

    document.querySelector('.viewer-nav.next').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateImage();
    });

    // Adicionar handlers para zoom
    document.querySelector('.zoom-in').addEventListener('click', () => {
        if (currentZoom < 3) {
            currentZoom += 0.5;
            viewerImage.style.transform = `scale(${currentZoom})`;
        }
    });

    document.querySelector('.zoom-out').addEventListener('click', () => {
        if (currentZoom > 1) {
            currentZoom -= 0.5;
            viewerImage.style.transform = `scale(${currentZoom})`;
        }
    });

    // Resetar zoom ao fechar ou mudar imagem
    function resetZoom() {
        currentZoom = 1;
        viewerImage.style.transform = 'scale(1)';
    }

    // Fechar viewer
    document.querySelector('.viewer-close').addEventListener('click', () => {
        resetZoom();
        viewer.style.display = 'none';
    });

    // Fechar ao clicar fora
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) {
            viewer.style.display = 'none';
        }
    });
});

// Background Animation
function initHeroAnimation() {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
        }

        update() {
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            
            if (distance < maxDistance) {
                this.speedX += forceDirectionX * force * 0.5;
                this.speedY += forceDirectionY * force * 0.5;
            }

            this.x += this.speedX;
            this.y += this.speedY;

            this.speedX *= 0.95;
            this.speedY *= 0.95;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    init();
    animate();
}

document.addEventListener('DOMContentLoaded', initHeroAnimation);

document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = hero.getBoundingClientRect();
        
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        
        hero.style.setProperty('--mouse-x', `${x * 20}px`);
        hero.style.setProperty('--mouse-y', `${y * 20}px`);
        
        const gradients = hero.querySelectorAll('.hero::after');
        gradients.forEach(gradient => {
            gradient.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    const parallaxLayer = document.createElement('div');
    parallaxLayer.className = 'hero-parallax';
    hero.insertBefore(parallaxLayer, hero.firstChild);

    function handleMouseMove(e) {
        const { width, height } = hero.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const xPos = (mouseX / width - 0.5) * 40;
        const yPos = (mouseY / height - 0.5) * 40;

        parallaxLayer.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        hero.querySelector('.hero-content').style.transform = 
            `translate3d(${xPos * 0.3}px, ${yPos * 0.3}px, 0)`;
    }

    hero.addEventListener('mousemove', handleMouseMove);
});

// Rain Animation
function initRainEffect() {
    const canvas = document.getElementById('rainCanvas');
    const ctx = canvas.getContext('2d');
    let raindrops = [];
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class RainDrop {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.baseSpeed = 5 + Math.random() * 10;
            this.speedX = 0;
            this.speedY = this.baseSpeed;
            this.length = 10 + Math.random() * 20;
            this.opacity = 0.1 + Math.random() * 0.4;
        }

        update() {
            // Calcular distância do mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Influência do mouse
            if (distance < 100) {
                const influence = (100 - distance) / 100;
                this.speedX = (dx / distance) * influence * 5;
                this.speedY = this.baseSpeed + (dy / distance) * influence * 2;
            } else {
                this.speedX *= 0.95;
                this.speedY = this.baseSpeed;
            }

            // Atualizar posição
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.speedX, this.y + this.length);
            ctx.strokeStyle = `rgba(174, 194, 244, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function createRain() {
        for (let i = 0; i < 100; i++) {
            raindrops.push(new RainDrop());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raindrops.forEach(drop => {
            drop.update();
            drop.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createRain();
    animate();
}

document.addEventListener('DOMContentLoaded', initRainEffect);
