// credit-score.js - Credit Score page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the credit score page
    initCreditScorePage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadCreditData();
});

// Global variables
let currentScore = 720;
let previousScore = 710;
let creditFactors = {
    paymentHistory: 100,
    creditUtilization: 30,
    historyLength: 5,
    creditMix: 75,
    newCredit: 2
};
let scoreHistory = [];
let securityAlerts = [];

// Initialize the page
function initCreditScorePage() {
    // Initialize navigation
    initNavigation();
    
    // Generate sample score history
    generateScoreHistory();
    
    // Initialize charts
    initScoreGauge();
    initScoreTimeline();
}

// Set up event listeners
function setupEventListeners() {
    // Factor sliders
    document.getElementById('paymentHistory').addEventListener('input', updatePaymentHistory);
    document.getElementById('creditUtilization').addEventListener('input', updateCreditUtilization);
    document.getElementById('historyLength').addEventListener('input', updateHistoryLength);
    document.getElementById('creditMix').addEventListener('input', updateCreditMix);
    document.getElementById('newCredit').addEventListener('input', updateNewCredit);
    
    // Control buttons
    document.getElementById('applyChanges').addEventListener('click', applyFactorChanges);
    document.getElementById('resetFactors').addEventListener('click', resetFactors);
    document.getElementById('refreshScore').addEventListener('click', refreshScore);
    document.getElementById('exportReport').addEventListener('click', exportReport);
    
    // Recommendation actions
    document.getElementById('setupAutopay').addEventListener('click', setupAutopay);
    document.getElementById('requestIncrease').addEventListener('click', requestIncrease);
    document.getElementById('exploreLoans').addEventListener('click', exploreLoans);
    
    // Security actions
    document.getElementById('runSecurityCheck').addEventListener('click', runSecurityCheck);
    document.getElementById('freezeCredit').addEventListener('click', toggleCreditFreeze);
    
    // Dismiss buttons for recommendations
    document.getElementById('dismissPayment').addEventListener('click', () => dismissRecommendation('payment'));
    document.getElementById('dismissUtilization').addEventListener('click', () => dismissRecommendation('utilization'));
    document.getElementById('dismissMix').addEventListener('click', () => dismissRecommendation('mix'));
}

// Initialize navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// Load credit data
function loadCreditData() {
    // Simulate API call delay
    setTimeout(() => {
        updateScoreDisplay();
        updateFactorDisplays();
        updateRecommendations();
        updateSecurityAlerts();
        updateLastUpdated();
    }, 500);
}

// Update score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById('currentScore');
    const categoryElement = document.getElementById('scoreCategory');
    const changeElement = document.getElementById('scoreChange');
    const explanationElement = document.getElementById('scoreExplanation');
    
    if (scoreElement) scoreElement.textContent = currentScore;
    
    // Determine score category
    let category, categoryColor;
    if (currentScore >= 800) {
        category = 'Excellent';
        categoryColor = '#10b981';
    } else if (currentScore >= 740) {
        category = 'Very Good';
        categoryColor = '#22c55e';
    } else if (currentScore >= 670) {
        category = 'Good';
        categoryColor = '#eab308';
    } else if (currentScore >= 580) {
        category = 'Fair';
        categoryColor = '#f97316';
    } else {
        category = 'Poor';
        categoryColor = '#ef4444';
    }
    
    if (categoryElement) {
        categoryElement.textContent = category;
        categoryElement.style.color = categoryColor;
    }
    
    // Calculate and display score change
    if (changeElement) {
        const change = currentScore - previousScore;
        if (change > 0) {
            changeElement.textContent = `+${change} points`;
            changeElement.className = 'score-change positive';
        } else if (change < 0) {
            changeElement.textContent = `${change} points`;
            changeElement.className = 'score-change negative';
        } else {
            changeElement.textContent = 'No change';
            changeElement.className = 'score-change neutral';
        }
    }
    
    // Update explanation based on score
    if (explanationElement) {
        if (currentScore >= 740) {
            explanationElement.textContent = 'Your credit score is excellent! You should have no trouble qualifying for the best rates and terms.';
        } else if (currentScore >= 670) {
            explanationElement.textContent = 'Your credit score is good. You qualify for most credit products but may not get the very best rates.';
        } else if (currentScore >= 580) {
            explanationElement.textContent = 'Your credit score is fair. You may qualify for some credit products but likely with higher interest rates.';
        } else {
            explanationElement.textContent = 'Your credit score needs improvement. Focus on paying down debt and making payments on time to raise your score.';
        }
    }
    
    // Update the gauge chart
    updateScoreGauge();
}

// Update factor displays
function updateFactorDisplays() {
    document.getElementById('paymentHistoryValue').textContent = `${creditFactors.paymentHistory}%`;
    document.getElementById('creditUtilizationValue').textContent = `${creditFactors.creditUtilization}%`;
    document.getElementById('historyLengthValue').textContent = `${creditFactors.historyLength} years`;
    
    // Credit mix quality
    let mixQuality;
    if (creditFactors.creditMix >= 80) mixQuality = 'Excellent';
    else if (creditFactors.creditMix >= 60) mixQuality = 'Good';
    else if (creditFactors.creditMix >= 40) mixQuality = 'Fair';
    else mixQuality = 'Poor';
    
    document.getElementById('creditMixValue').textContent = mixQuality;
    document.getElementById('newCreditValue').textContent = creditFactors.newCredit;
}

// Update AI recommendations
function updateRecommendations() {
    // Payment recommendation
    const paymentRec = document.getElementById('paymentRecommendation');
    if (creditFactors.paymentHistory < 95) {
        paymentRec.textContent = `You have ${100 - creditFactors.paymentHistory}% late payments. Setting up automatic payments can help ensure you never miss a due date.`;
    } else {
        paymentRec.textContent = 'Your payment history is excellent! Continue making payments on time to maintain your good standing.';
    }
    
    // Utilization recommendation
    const utilizationRec = document.getElementById('utilizationRecommendation');
    if (creditFactors.creditUtilization > 30) {
        utilizationRec.textContent = `Your credit utilization is ${creditFactors.creditUtilization}%, which is above the recommended 30%. Consider paying down balances to improve your score.`;
    } else {
        utilizationRec.textContent = 'Your credit utilization is at a healthy level. Consider requesting a credit limit increase to further improve your ratio.';
    }
    
    // Credit mix recommendation
    const mixRec = document.getElementById('mixRecommendation');
    if (creditFactors.creditMix < 50) {
        mixRec.textContent = 'You have limited credit diversity. Adding a different type of credit, like a small installment loan, could improve your score over time.';
    } else {
        mixRec.textContent = 'You have a good mix of credit types. Maintaining this diversity will help your credit score.';
    }
}

// Update security alerts
function updateSecurityAlerts() {
    const alertList = document.getElementById('alertList');
    const alertCount = document.getElementById('alertCount');
    
    if (securityAlerts.length === 0) {
        alertList.innerHTML = '<p class="no-alerts">No suspicious activity detected. Your credit profile appears secure.</p>';
        alertCount.textContent = '0 active alerts';
    } else {
        alertList.innerHTML = securityAlerts.map(alert => `
            <div class="alert-item">
                <div class="alert-icon ${alert.severity}">${alert.icon}</div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-description">${alert.description}</div>
                </div>
                <div class="alert-actions">
                    <button class="btn btn-sm ${alert.severity === 'danger' ? 'btn-danger' : 'btn-warning'}" onclick="resolveAlert('${alert.id}')">Resolve</button>
                </div>
            </div>
        `).join('');
        alertCount.textContent = `${securityAlerts.length} active alert${securityAlerts.length !== 1 ? 's' : ''}`;
    }
}

// Update last updated timestamp
function updateLastUpdated() {
    const lastUpdated = document.getElementById('lastUpdated');
    if (lastUpdated) {
        lastUpdated.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize score gauge
function initScoreGauge() {
    const canvas = document.getElementById('scoreGauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    updateScoreGauge(ctx);
}

// Update score gauge
function updateScoreGauge() {
    const canvas = document.getElementById('scoreGauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height;
    const radius = width / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw gauge background (semi-circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    // Calculate angle based on score (300-850 range)
    const minScore = 300;
    const maxScore = 850;
    const scoreRange = maxScore - minScore;
    const scorePercentage = (currentScore - minScore) / scoreRange;
    const angle = Math.PI + (Math.PI * scorePercentage);
    
    // Draw score arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, angle);
    ctx.lineWidth = 20;
    
    // Color based on score
    if (currentScore >= 800) ctx.strokeStyle = '#10b981';
    else if (currentScore >= 740) ctx.strokeStyle = '#22c55e';
    else if (currentScore >= 670) ctx.strokeStyle = '#eab308';
    else if (currentScore >= 580) ctx.strokeStyle = '#f97316';
    else ctx.strokeStyle = '#ef4444';
    
    ctx.stroke();
    
    // Add score markers
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    // Poor marker (300)
    ctx.fillText('300', centerX - radius * 0.9, centerY - 10);
    // Fair marker (580)
    ctx.fillText('580', centerX - radius * 0.45, centerY - radius * 0.45);
    // Good marker (670)
    ctx.fillText('670', centerX, centerY - radius * 0.9);
    // Very Good marker (740)
    ctx.fillText('740', centerX + radius * 0.45, centerY - radius * 0.45);
    // Excellent marker (850)
    ctx.fillText('850', centerX + radius * 0.9, centerY - 10);
}

// Initialize score timeline
function initScoreTimeline() {
    const canvas = document.getElementById('scoreTimeline');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    updateScoreTimeline(ctx);
}

// Update score timeline
function updateScoreTimeline() {
    const canvas = document.getElementById('scoreTimeline');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (scoreHistory.length === 0) return;
    
    // Calculate scaling factors
    const minScore = Math.min(...scoreHistory.map(s => s.score));
    const maxScore = Math.max(...scoreHistory.map(s => s.score));
    const scoreRange = maxScore - minScore || 100; // Avoid division by zero
    
    const xScale = (width - padding * 2) / (scoreHistory.length - 1);
    const yScale = (height - padding * 2) / scoreRange;
    
    // Draw grid lines and labels
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - padding * 2) * (i / 5);
        const score = Math.round(minScore + (maxScore - minScore) * (1 - i / 5));
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        ctx.fillText(score.toString(), padding - 20, y + 4);
    }
    
    // X-axis labels (dates)
    scoreHistory.forEach((point, index) => {
        if (index % 3 === 0) { // Show every 3rd label to avoid clutter
            const x = padding + index * xScale;
            const date = new Date(point.date);
            const label = `${date.getMonth() + 1}/${date.getDate()}`;
            
            ctx.fillText(label, x, height - padding + 20);
        }
    });
    
    // Draw score line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    
    scoreHistory.forEach((point, index) => {
        const x = padding + index * xScale;
        const y = padding + (maxScore - point.score) * yScale;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#3b82f6';
    scoreHistory.forEach((point, index) => {
        const x = padding + index * xScale;
        const y = padding + (maxScore - point.score) * yScale;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Generate sample score history
function generateScoreHistory() {
    const today = new Date();
    scoreHistory = [];
    
    // Generate 12 months of data
    for (let i = 11; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 15);
        
        // Create realistic fluctuations
        let score;
        if (i === 11) {
            score = 690; // Starting point
        } else {
            const previousScore = scoreHistory[scoreHistory.length - 1].score;
            // Random change between -10 and +15 points
            const change = Math.floor(Math.random() * 26) - 10;
            score = Math.max(300, Math.min(850, previousScore + change));
        }
        
        scoreHistory.push({
            date: date.toISOString().split('T')[0],
            score: score
        });
    }
    
    // Set current and previous scores based on history
    currentScore = scoreHistory[scoreHistory.length - 1].score;
    previousScore = scoreHistory[scoreHistory.length - 2].score;
}

// Factor update functions
function updatePaymentHistory(e) {
    const value = parseInt(e.target.value);
    creditFactors.paymentHistory = value;
    document.getElementById('paymentHistoryValue').textContent = `${value}%`;
}

function updateCreditUtilization(e) {
    const value = parseInt(e.target.value);
    creditFactors.creditUtilization = value;
    document.getElementById('creditUtilizationValue').textContent = `${value}%`;
}

function updateHistoryLength(e) {
    const value = parseInt(e.target.value);
    creditFactors.historyLength = value;
    document.getElementById('historyLengthValue').textContent = `${value} years`;
}

function updateCreditMix(e) {
    const value = parseInt(e.target.value);
    creditFactors.creditMix = value;
    
    let mixQuality;
    if (value >= 80) mixQuality = 'Excellent';
    else if (value >= 60) mixQuality = 'Good';
    else if (value >= 40) mixQuality = 'Fair';
    else mixQuality = 'Poor';
    
    document.getElementById('creditMixValue').textContent = mixQuality;
}

function updateNewCredit(e) {
    const value = parseInt(e.target.value);
    creditFactors.newCredit = value;
    document.getElementById('newCreditValue').textContent = value;
}

// Apply factor changes to score
function applyFactorChanges() {
    // Calculate score change based on factors
    let change = 0;
    
    // Payment history impact (35%)
    const paymentChange = (creditFactors.paymentHistory - 100) * 0.35;
    change += paymentChange;
    
    // Credit utilization impact (30%)
    const utilizationChange = (30 - creditFactors.creditUtilization) * 0.3;
    change += utilizationChange;
    
    // History length impact (15%)
    const historyChange = (creditFactors.historyLength - 5) * 0.15;
    change += historyChange;
    
    // Credit mix impact (10%)
    const mixChange = (creditFactors.creditMix - 75) * 0.1;
    change += mixChange;
    
    // New credit impact (10%)
    const newCreditChange = (2 - creditFactors.newCredit) * 0.1;
    change += newCreditChange;
    
    // Update scores
    previousScore = currentScore;
    currentScore = Math.max(300, Math.min(850, Math.round(currentScore + change)));
    
    // Add to history
    const today = new Date();
    scoreHistory.push({
        date: today.toISOString().split('T')[0],
        score: currentScore
    });
    
    // Keep only last 12 months
    if (scoreHistory.length > 12) {
        scoreHistory.shift();
    }
    
    // Update displays
    updateScoreDisplay();
    updateScoreTimeline();
    
    // Show confirmation
    showNotification(`Credit score updated to ${currentScore}`, 'success');
}

// Reset factors to current values
function resetFactors() {
    creditFactors = {
        paymentHistory: 100,
        creditUtilization: 30,
        historyLength: 5,
        creditMix: 75,
        newCredit: 2
    };
    
    document.getElementById('paymentHistory').value = 100;
    document.getElementById('creditUtilization').value = 30;
    document.getElementById('historyLength').value = 5;
    document.getElementById('creditMix').value = 75;
    document.getElementById('newCredit').value = 2;
    
    updateFactorDisplays();
    showNotification('Factors reset to current values', 'info');
}

// Refresh score
function refreshScore() {
    // Simulate API call
    showNotification('Refreshing credit score...', 'info');
    
    setTimeout(() => {
        // Small random fluctuation
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        previousScore = currentScore;
        currentScore = Math.max(300, Math.min(850, currentScore + change));
        
        // Update history
        const today = new Date();
        scoreHistory[scoreHistory.length - 1] = {
            date: today.toISOString().split('T')[0],
            score: currentScore
        };
        
        updateScoreDisplay();
        updateScoreTimeline();
        updateLastUpdated();
        
        showNotification(`Credit score refreshed: ${currentScore}`, 'success');
    }, 1500);
}

// Export report
function exportReport() {
    showNotification('Generating credit report PDF...', 'info');
    
    // Simulate PDF generation
    setTimeout(() => {
        showNotification('Credit report downloaded successfully', 'success');
        
        // In a real app, this would trigger a download
        // For demo purposes, we'll just show a message
        const reportData = {
            score: currentScore,
            factors: creditFactors,
            history: scoreHistory,
            date: new Date().toISOString()
        };
        
        console.log('Credit Report Data:', reportData);
    }, 2000);
}

// Recommendation actions
function setupAutopay() {
    showNotification('Redirecting to autopay setup...', 'info');
    // In a real app, this would navigate to autopay setup
}

function requestIncrease() {
    showNotification('Processing credit limit increase request...', 'info');
    
    setTimeout(() => {
        showNotification('Credit limit increase request submitted', 'success');
    }, 1500);
}

function exploreLoans() {
    showNotification('Showing loan options...', 'info');
    // In a real app, this would navigate to loan exploration
}

// Security actions
function runSecurityCheck() {
    showNotification('Running security check...', 'info');
    
    setTimeout(() => {
        // Simulate finding security issues
        const issues = Math.random() > 0.7 ? 1 : 0; // 30% chance of finding an issue
        
        if (issues > 0) {
            securityAlerts.push({
                id: 'alert-' + Date.now(),
                title: 'Suspicious Credit Inquiry Detected',
                description: 'An unfamiliar credit inquiry was found on your report from 2 days ago.',
                severity: 'warning',
                icon: '⚠️'
            });
            
            showNotification('Security check completed: Issues found', 'warning');
        } else {
            showNotification('Security check completed: No issues found', 'success');
        }
        
        updateSecurityAlerts();
    }, 2000);
}

function toggleCreditFreeze() {
    const freezeButton = document.getElementById('freezeCredit');
    const statusElement = document.getElementById('monitoringStatus');
    
    if (freezeButton.textContent === 'Freeze Credit') {
        freezeButton.textContent = 'Unfreeze Credit';
        freezeButton.classList.remove('btn-primary');
        freezeButton.classList.add('btn-warning');
        
        if (statusElement) {
            statusElement.innerHTML = '<i>❄️</i><span>Frozen</span>';
            statusElement.className = 'security-status warning';
        }
        
        showNotification('Credit freeze activated', 'success');
    } else {
        freezeButton.textContent = 'Freeze Credit';
        freezeButton.classList.remove('btn-warning');
        freezeButton.classList.add('btn-primary');
        
        if (statusElement) {
            statusElement.innerHTML = '<i>🔒</i><span>Active</span>';
            statusElement.className = 'security-status active';
        }
        
        showNotification('Credit freeze deactivated', 'info');
    }
}

// Dismiss recommendation
function dismissRecommendation(type) {
    const card = document.querySelector(`#${type}Recommendation`).closest('.recommendation-card');
    card.style.opacity = '0.5';
    card.style.pointerEvents = 'none';
    
    showNotification('Recommendation dismissed', 'info');
}

// Resolve alert
function resolveAlert(alertId) {
    securityAlerts = securityAlerts.filter(alert => alert.id !== alertId);
    updateSecurityAlerts();
    showNotification('Alert resolved', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-md);
                color: white;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                box-shadow: var(--shadow-lg);
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-info { background-color: #3b82f6; }
            .notification-success { background-color: #10b981; }
            .notification-warning { background-color: #f59e0b; }
            .notification-error { background-color: #ef4444; }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Add slideOut animation
if (!document.querySelector('#notification-animations')) {
    const animations = document.createElement('style');
    animations.id = 'notification-animations';
    animations.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(animations);
}