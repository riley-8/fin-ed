// dashboard.js - Dashboard specific functionality
class Dashboard {
    constructor() {
        this.currentUser = window.finSecureApp?.currentUser;
        this.init();
    }

    init() {
        this.setupCharts();
        this.setupInteractiveElements();
        this.loadUserData();
        this.setupRealTimeUpdates();
    }

    setupCharts() {
        this.setupFinancialHealthChart();
        this.setupSecurityChart();
        this.setupProgressCharts();
    }

    setupFinancialHealthChart() {
        // This would integrate with a charting library in a real implementation
        const financialScore = 78;
        this.animateScoreCircle('.financial-health .score-circle svg circle:nth-child(2)', financialScore);
    }

    setupSecurityChart() {
        const securityScore = 70;
        this.animateScoreCircle('.cyber-safety .score-circle svg circle:nth-child(2)', securityScore);
    }

    animateScoreCircle(selector, score) {
        const circle = document.querySelector(selector);
        if (!circle) return;

        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1s ease-in-out';
            circle.style.strokeDashoffset = offset;
        }, 100);
    }

    setupProgressCharts() {
        // Animate progress bars
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = width;
            }, 500);
        });

        // Animate breakdown progress bars
        document.querySelectorAll('.breakdown-progress').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 800);
        });
    }

    setupInteractiveElements() {
        // Setup alert actions
        document.querySelectorAll('.alert-actions .btn').forEach(button => {
            button.addEventListener('click', this.handleAlertAction.bind(this));
        });

        // Setup quick action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', this.trackQuickAction.bind(this));
        });

        // Setup goal progress interactions
        document.querySelectorAll('.goal-item').forEach(goal => {
            goal.addEventListener('click', this.showGoalDetails.bind(this));
        });
    }

    handleAlertAction(event) {
        const button = event.currentTarget;
        const alertCard = button.closest('.alert-card');
        const alertType = alertCard.classList.contains('critical') ? 'critical' : 
                         alertCard.classList.contains('warning') ? 'warning' : 'info';

        switch (button.textContent.trim()) {
            case 'Review':
                this.reviewSecurityAlert(alertCard);
                break;
            case 'Update':
                this.updateSecurityFeatures();
                break;
            case 'Explore':
                this.exploreInvestmentOpportunity();
                break;
        }

        // Track the action
        this.trackUserAction('alert_action', { type: alertType, action: button.textContent.trim() });
    }

    reviewSecurityAlert(alertCard) {
        // Simulate security review process
        alertCard.style.opacity = '0.7';
        
        const reviewBtn = alertCard.querySelector('.btn');
        reviewBtn.textContent = 'Reviewing...';
        reviewBtn.disabled = true;

        setTimeout(() => {
            alertCard.classList.remove('critical');
            alertCard.classList.add('info');
            
            const icon = alertCard.querySelector('.alert-icon i');
            icon.className = 'fas fa-check-circle';
            alertCard.querySelector('.alert-icon').style.background = 'rgba(16, 185, 129, 0.1)';
            
            alertCard.querySelector('h3').textContent = 'Issue Resolved';
            alertCard.querySelector('p').textContent = 'The security concern has been addressed.';
            
            reviewBtn.textContent = 'Resolved';
            reviewBtn.className = 'btn btn-sm btn-success';
            reviewBtn.disabled = false;
            alertCard.style.opacity = '1';
        }, 2000);
    }

    updateSecurityFeatures() {
        // Simulate security update
        const updateBtn = document.querySelector('.alert-card.warning .btn');
        updateBtn.textContent = 'Updating...';
        updateBtn.disabled = true;

        setTimeout(() => {
            updateBtn.textContent = 'Updated';
            updateBtn.className = 'btn btn-sm btn-success';
            updateBtn.disabled = false;
            
            // Award security badge
            if (window.finSecureApp) {
                window.finSecureApp.awardBadge('security-expert');
            }
        }, 1500);
    }

    exploreInvestmentOpportunity() {
        // Navigate to investing page with specific recommendation
        window.location.href = 'investing.html?recommendation=ai_optimized';
    }

    trackQuickAction(event) {
        const card = event.currentTarget;
        const action = card.querySelector('h3').textContent;
        
        this.trackUserAction('quick_action', { action: action });
    }

    showGoalDetails(event) {
        const goalItem = event.currentTarget;
        const goalName = goalItem.querySelector('h4').textContent;
        
        // Show goal details modal or navigate to goals page
        this.showModal('Goal Details', `Showing details for: ${goalName}`);
    }

    showModal(title, content) {
        // Simple modal implementation for demo purposes
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: var(--radius-lg);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        document.body.appendChild(modal);
    }

    loadUserData() {
        // Load and display user-specific data
        if (this.currentUser) {
            this.updateDashboardWithUserData();
        } else {
            // Try to load from localStorage
            const userData = localStorage.getItem('finsecure-user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateDashboardWithUserData();
            }
        }
    }

    updateDashboardWithUserData() {
        // Update dashboard elements with user data
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(el => {
            el.textContent = this.currentUser.name || 'User';
        });

        // Update financial health score based on user data
        this.calculateFinancialHealthScore();
        
        // Update learning progress
        this.updateLearningProgress();
    }

    calculateFinancialHealthScore() {
        // Calculate score based on user's financial data
        if (!this.currentUser?.financialData) return;

        const data = this.currentUser.financialData;
        let score = 50; // Base score

        // Budget adherence (up to 20 points)
        if (data.budgetAdherence > 80) score += 20;
        else if (data.budgetAdherence > 60) score += 15;
        else if (data.budgetAdherence > 40) score += 10;

        // Savings rate (up to 15 points)
        if (data.savingsRate > 20) score += 15;
        else if (data.savingsRate > 10) score += 10;
        else if (data.savingsRate > 5) score += 5;

        // Debt management (up to 15 points)
        if (data.debtToIncome < 0.3) score += 15;
        else if (data.debtToIncome < 0.5) score += 10;
        else if (data.debtToIncome < 0.7) score += 5;

        // Update the UI
        const scoreElement = document.querySelector('.financial-health .score-circle text');
        if (scoreElement) {
            scoreElement.textContent = Math.min(score, 100);
        }
    }

    updateLearningProgress() {
        if (!this.currentUser?.learningProgress) return;

        const progress = this.currentUser.learningProgress;
        const progressBar = document.querySelector('.learning-progress .progress-fill');
        const percentElement = document.querySelector('.progress-percent');

        if (progressBar && percentElement) {
            const percent = Math.round((progress.completed / progress.total) * 100);
            progressBar.style.width = `${percent}%`;
            percentElement.textContent = `${percent}%`;
        }
    }

    setupRealTimeUpdates() {
        // Simulate real-time security updates
        this.securityUpdateInterval = setInterval(() => {
            this.updateSecurityStatus();
        }, 30000); // Every 30 seconds

        // Simulate financial data updates
        this.financialUpdateInterval = setInterval(() => {
            this.updateFinancialData();
        }, 60000); // Every minute
    }

    updateSecurityStatus() {
        // Simulate security status updates
        const statusItems = document.querySelectorAll('.status-item');
        statusItems.forEach(item => {
            // Randomly update status for demo purposes
            if (Math.random() > 0.8) {
                item.classList.toggle('safe');
                item.classList.toggle('warning');
                
                const icon = item.querySelector('i');
                if (item.classList.contains('safe')) {
                    icon.className = 'fas fa-check-circle';
                } else {
                    icon.className = 'fas fa-exclamation-triangle';
                }
            }
        });
    }

    updateFinancialData() {
        // Simulate financial data updates
        const metricValue = document.querySelector('.financial-health .metric-value');
        if (metricValue) {
            const currentValue = parseInt(metricValue.textContent.replace(/[^0-9]/g, ''));
            const change = Math.random() * 100 - 50; // Random change between -50 and +50
            const newValue = Math.max(0, currentValue + change);
            
            metricValue.textContent = `R${newValue.toLocaleString()}`;
        }
    }

    trackUserAction(action, data) {
        // In a real app, this would send data to analytics
        console.log('User action:', action, data);
        
        // Store locally for demo purposes
        const actions = JSON.parse(localStorage.getItem('user-actions') || '[]');
        actions.push({
            action,
            data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('user-actions', JSON.stringify(actions));
    }

    destroy() {
        // Clean up intervals
        if (this.securityUpdateInterval) {
            clearInterval(this.securityUpdateInterval);
        }
        if (this.financialUpdateInterval) {
            clearInterval(this.financialUpdateInterval);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Export for potential use in other modules
window.Dashboard = Dashboard;