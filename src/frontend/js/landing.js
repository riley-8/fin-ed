// landing.js - Landing page specific functionality
class LandingPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.setupInteractiveElements();
        this.setupChart();
    }

    setupNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .security-feature').forEach(el => {
            observer.observe(el);
        });
    }

    setupInteractiveElements() {
        // Interactive dashboard preview
        const dashboardPreview = document.querySelector('.dashboard-preview');
        if (dashboardPreview) {
            dashboardPreview.addEventListener('mouseenter', this.animateDashboard.bind(this));
            dashboardPreview.addEventListener('mouseleave', this.resetDashboard.bind(this));
        }

        // Security shield animation
        const securityShield = document.querySelector('.security-shield');
        if (securityShield) {
            securityShield.addEventListener('click', this.activateShield.bind(this));
        }
    }

    animateDashboard() {
        const metricValue = document.querySelector('.metric-value');
        const metricChange = document.querySelector('.metric-change');
        
        if (metricValue && metricChange) {
            // Simulate real-time updates
            let value = 24573;
            let change = 5.2;
            
            const interval = setInterval(() => {
                value += Math.random() * 100 - 50;
                change += Math.random() * 0.5 - 0.25;
                
                metricValue.textContent = `R${Math.round(value).toLocaleString()}`;
                metricChange.textContent = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
                metricChange.className = `metric-change ${change >= 0 ? 'positive' : 'negative'}`;
            }, 1000);
            
            this.dashboardInterval = interval;
        }
    }

    resetDashboard() {
        if (this.dashboardInterval) {
            clearInterval(this.dashboardInterval);
            this.dashboardInterval = null;
        }
        
        const metricValue = document.querySelector('.metric-value');
        const metricChange = document.querySelector('.metric-change');
        
        if (metricValue && metricChange) {
            metricValue.textContent = 'R24,573';
            metricChange.textContent = '+5.2%';
            metricChange.className = 'metric-change positive';
        }
    }

    activateShield() {
        const shield = document.querySelector('.security-shield i');
        const rings = document.querySelectorAll('.protection-ring');
        
        shield.style.color = '#10b981';
        shield.classList.add('fa-beat');
        
        rings.forEach(ring => {
            ring.style.borderColor = '#10b981';
            ring.style.animationDuration = '1s';
        });
        
        setTimeout(() => {
            shield.style.color = '';
            shield.classList.remove('fa-beat');
            rings.forEach(ring => {
                ring.style.borderColor = '';
                ring.style.animationDuration = '';
            });
        }, 2000);
    }

    setupChart() {
        const canvas = document.getElementById('hero-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Simple line chart animation
        this.drawChart(ctx, canvas.width, canvas.height);
    }

    drawChart(ctx, width, height) {
        const data = [30, 45, 35, 55, 40, 60, 50, 70, 65, 80, 75, 85];
        const padding = 20;
        const maxValue = Math.max(...data);
        const xStep = (width - padding * 2) / (data.length - 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - padding * 2) * (i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = height - padding - (value / maxValue) * (height - padding * 2);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = height - padding - (value / maxValue) * (height - padding * 2);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
});

// Additional landing page utilities
const landingUtils = {
    // Newsletter signup
    setupNewsletter: () => {
        const form = document.getElementById('newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                landingUtils.subscribeNewsletter(email);
            });
        }
    },

    subscribeNewsletter: async (email) => {
        if (!FinSecureUtils.validateEmail(email)) {
            landingUtils.showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            landingUtils.showNotification('Successfully subscribed to newsletter!', 'success');
        } catch (error) {
            landingUtils.showNotification('Subscription failed. Please try again.', 'error');
        }
    },

    showNotification: (message, type) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = 'var(--success-color)';
        } else {
            notification.style.background = 'var(--danger-color)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Demo request form
    setupDemoRequest: () => {
        const form = document.getElementById('demo-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                landingUtils.requestDemo(formData);
            });
        }
    },

    requestDemo: async (formData) => {
        try {
            // Simulate demo request submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            landingUtils.showNotification('Demo request received! We\'ll contact you soon.', 'success');
            document.getElementById('demo-form').reset();
        } catch (error) {
            landingUtils.showNotification('Request failed. Please try again.', 'error');
        }
    }
};

// Initialize newsletter and demo forms
document.addEventListener('DOMContentLoaded', () => {
    landingUtils.setupNewsletter();
    landingUtils.setupDemoRequest();
});