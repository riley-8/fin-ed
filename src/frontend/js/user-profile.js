// user-profile.js - User Profile functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const profileSections = document.querySelectorAll('.profile-section');
    const financialChartCanvas = document.getElementById('financialChart');
    const securityChartCanvas = document.getElementById('securityChart');
    const infoForm = document.querySelector('.info-form');
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    // Navigation functionality
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            profileSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Initialize charts
    if (financialChartCanvas) {
        initializeFinancialChart();
    }
    
    if (securityChartCanvas) {
        initializeSecurityChart();
    }
    
    // Form submission
    infoForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileInfo();
    });
    
    // Toggle switch functionality
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            updateSetting(this);
        });
    });
    
    // Avatar edit functionality
    const avatarEdit = document.querySelector('.avatar-edit');
    avatarEdit?.addEventListener('click', function() {
        changeAvatar();
    });
    
    // Functions
    function initializeFinancialChart() {
        const ctx = financialChartCanvas.getContext('2d');
        
        // Sample data for financial progress
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Budget Adherence',
                    data: [65, 70, 75, 80, 78, 85],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Savings Rate',
                    data: [20, 25, 30, 35, 32, 38],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Investment Growth',
                    data: [5, 8, 12, 15, 18, 22],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        };
        
        // Create chart
        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    function initializeSecurityChart() {
        const ctx = securityChartCanvas.getContext('2d');
        
        // Sample data for security activity
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Threats Detected',
                    data: [12, 15, 8, 10, 14, 9],
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: '#ef4444',
                    borderWidth: 1
                },
                {
                    label: 'Threats Prevented',
                    data: [10, 12, 7, 9, 13, 8],
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 1
                }
            ]
        };
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Threats'
                        }
                    }
                }
            }
        });
    }
    
    function saveProfileInfo() {
        const formData = new FormData(infoForm);
        const submitButton = infoForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner"></div> Saving...';
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Profile updated successfully!', 'success');
            
            // Restore button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1500);
    }
    
    function updateSetting(toggle) {
        const settingName = toggle.closest('.setting-item').querySelector('h4').textContent;
        const isEnabled = toggle.checked;
        
        showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
        
        // Simulate API call to update setting
        // In a real app, this would send a request to the backend
    }
    
    function changeAvatar() {
        // In a real app, this would open a file picker
        // For demo purposes, we'll simulate avatar change
        const avatarImg = document.querySelector('.avatar-img');
        const randomSeed = Math.random().toString(36).substring(7);
        
        avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
        showNotification('Avatar updated!', 'success');
    }
    
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add CSS for notifications and spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Simulate real-time updates for demonstration
    simulateRealTimeUpdates();
    
    function simulateRealTimeUpdates() {
        // Update financial score periodically
        setInterval(() => {
            const financialScore = document.querySelector('.metric-card:nth-child(1) .metric-value');
            if (financialScore) {
                const currentScore = parseInt(financialScore.textContent);
                const newScore = Math.min(100, currentScore + Math.floor(Math.random() * 2));
                if (newScore !== currentScore) {
                    financialScore.textContent = `${newScore}/100`;
                    document.querySelector('.metric-card:nth-child(1) .progress-fill').style.width = `${newScore}%`;
                }
            }
        }, 10000);
        
        // Update security score periodically
        setInterval(() => {
            const securityScore = document.querySelector('.metric-card:nth-child(2) .metric-value');
            if (securityScore) {
                const currentScore = parseInt(securityScore.textContent);
                const newScore = Math.min(100, currentScore + Math.floor(Math.random() * 2));
                if (newScore !== currentScore) {
                    securityScore.textContent = `${newScore}/100`;
                    document.querySelector('.metric-card:nth-child(2) .progress-fill').style.width = `${newScore}%`;
                }
            }
        }, 15000);
    }
});