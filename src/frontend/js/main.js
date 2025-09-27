// main.js - Core application functionality and utilities
class FinSecureApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.setupServiceWorker();
    }

    setupEventListeners() {
        // Global navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-nav]') || e.target.closest('[data-nav]')) {
                e.preventDefault();
                const target = e.target.closest('[data-nav]').getAttribute('data-nav');
                this.navigateTo(target);
            }
        });

        // Global search
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleGlobalSearch, 300));
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme);
        }

        // AI Assistant toggle
        const aiAssistantToggle = document.getElementById('ai-assistant-toggle');
        if (aiAssistantToggle) {
            aiAssistantToggle.addEventListener('click', this.toggleAIAssistant);
        }
    }

    navigateTo(page) {
        // Simple SPA navigation (for demo purposes)
        window.location.href = `${page}.html`;
    }

    async loadUserData() {
        try {
            const userData = localStorage.getItem('finsecure-user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateUIForUser();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    updateUIForUser() {
        // Update UI elements based on user data
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(el => {
            if (this.currentUser) {
                el.textContent = this.currentUser.name || 'User';
            }
        });

        const userAvatarElements = document.querySelectorAll('[data-user-avatar]');
        userAvatarElements.forEach(el => {
            if (this.currentUser && this.currentUser.avatar) {
                el.src = this.currentUser.avatar;
            }
        });
    }

    handleGlobalSearch = (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            this.performSearch(query);
        }
    }

    async performSearch(query) {
        // Simulate search functionality
        const results = await this.searchContent(query);
        this.displaySearchResults(results);
    }

    async searchContent(query) {
        // Mock search results for demo
        return [
            { type: 'course', title: 'Budgeting Basics', description: 'Learn how to create and manage a personal budget', url: 'courses.html' },
            { type: 'article', title: 'Phishing Detection Guide', description: 'How to identify and avoid phishing attacks', url: 'security.html' },
            { type: 'tool', title: 'Investment Calculator', description: 'Calculate potential investment returns', url: 'calculators.html' }
        ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    displaySearchResults(results) {
        // Implementation would depend on UI requirements
        console.log('Search results:', results);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('finsecure-theme', newTheme);
    }

    toggleAIAssistant() {
        const assistant = document.getElementById('ai-assistant');
        if (assistant) {
            assistant.classList.toggle('active');
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    // Security features
    async scanURL(url) {
        // Mock URL scanning functionality
        try {
            const response = await fetch('/api/scan-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });
            
            return await response.json();
        } catch (error) {
            console.error('URL scan failed:', error);
            return { safe: false, risk: 'unknown', message: 'Scan unavailable' };
        }
    }

    // Financial calculations
    calculateCompoundInterest(principal, rate, time, compoundFrequency = 12) {
        return principal * Math.pow(1 + (rate / compoundFrequency), compoundFrequency * time);
    }

    // Gamification
    awardBadge(badgeId) {
        if (!this.currentUser) return;
        
        if (!this.currentUser.badges) {
            this.currentUser.badges = [];
        }
        
        if (!this.currentUser.badges.includes(badgeId)) {
            this.currentUser.badges.push(badgeId);
            this.saveUserData();
            this.showBadgeNotification(badgeId);
        }
    }

    showBadgeNotification(badgeId) {
        // Show notification for earned badge
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-icon">🏆</div>
            <div class="badge-info">
                <h4>New Badge Earned!</h4>
                <p>You've earned the "${this.getBadgeName(badgeId)}" badge</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getBadgeName(badgeId) {
        const badges = {
            'first-course': 'First Course Completed',
            'security-expert': 'Security Expert',
            'budget-master': 'Budget Master',
            'investment-guru': 'Investment Guru'
        };
        
        return badges[badgeId] || 'Achievement';
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('finsecure-user', JSON.stringify(this.currentUser));
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.finSecureApp = new FinSecureApp();
});

// Utility functions
const utils = {
    formatCurrency: (amount, currency = 'ZAR') => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    formatPercentage: (value, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value / 100);
    },

    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    },

    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    calculateAge: (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
};

// Export for use in other modules
window.FinSecureUtils = utils;