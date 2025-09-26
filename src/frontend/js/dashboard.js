// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize all dashboard components
    initializeSidebar();
    initializeNavigation();
    initializeAIWidget();
    initializeCharts();
    initializeScanners();
    initializeEducationTabs();
    initializeChallenges();
    initializeLifeSimulator();
    initializeNotifications();
    initializeSearch();
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Initialize section-specific functionality
                initializeSectionFeatures(targetSection);
            }
        });
    });
}

// Navigation Features
function initializeNavigation() {
    // Profile dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    // Notifications
    const notificationBtn = document.getElementById('notifications');
    const messagesBtn = document.getElementById('messages');
    
    notificationBtn.addEventListener('click', function() {
        showNotification('You have 3 new security alerts', 'info');
    });
    
    messagesBtn.addEventListener('click', function() {
        showNotification('You have 2 unread messages', 'info');
    });
}

// AI Widget Functionality
function initializeAIWidget() {
    const aiWidget = document.getElementById('ai-widget');
    const aiFab = document.getElementById('ai-fab');
    const closeWidget = document.getElementById('close-ai-widget');
    const aiInput = document.getElementById('ai-input');
    const sendAiMessage = document.getElementById('send-ai-message');
    const aiMessages = document.getElementById('ai-messages');
    
    // Toggle AI widget
    aiFab.addEventListener('click', function() {
        aiWidget.classList.add('active');
        aiFab.style.display = 'none';
    });
    
    closeWidget.addEventListener('click', function() {
        aiWidget.classList.remove('active');
        aiFab.style.display = 'flex';
    });
    
    // Send AI message
    function sendMessage() {
        const message = aiInput.value.trim();
        if (message) {
            addAIMessage(message, 'user');
            aiInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const responses = [
                    "I'd be happy to help you with that financial question. Let me analyze the current market trends for you.",
                    "That's a great security question! Here's what I recommend based on best practices.",
                    "Based on your portfolio, I suggest diversifying into these sectors for better risk management.",
                    "I've scanned that link and it appears to be safe. Here are the security details.",
                    "Your budget looks good! Here are some tips to optimize your savings further."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addAIMessage(randomResponse, 'ai');
            }, 1000);
        }
    }
    
    sendAiMessage.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addAIMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message-widget' : 'ai-message';
        messageDiv.innerHTML = `<p>${message}</p>`;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
}

// AI Chat in main section
function initializeAIChat() {
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const quickActions = document.querySelectorAll('.quick-action');
    
    // Send message function
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const responses = {
                    'investment': "Based on your risk profile, I recommend a diversified portfolio with 60% stocks, 30% bonds, and 10% alternative investments. Would you like me to explain each category?",
                    'link': "I can help you scan links for potential threats. Please paste the URL you'd like me to analyze for phishing attempts, malware, or other security risks.",
                    'budget': "Let's create a budget together! First, what's your monthly income? Then we'll categorize your expenses using the 50/30/20 rule as a starting point.",
                    'default': "That's a great question! Let me provide you with some personalized advice based on your financial profile and security settings."
                };
                
                let response = responses.default;
                if (message.toLowerCase().includes('invest')) response = responses.investment;
                if (message.toLowerCase().includes('link') || message.toLowerCase().includes('url')) response = responses.link;
                if (message.toLowerCase().includes('budget')) response = responses.budget;
                
                addChatMessage(response, 'ai');
            }, 1500);
        }
    }
    
    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Quick actions
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            chatInput.value = message;
            sendChatMessage();
        });
    });
    
    function addChatMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize Charts
function initializeCharts() {
    // Portfolio chart (simple canvas-based chart)
    const portfolioCanvas = document.getElementById('portfolio-chart');
    const performanceCanvas = document.getElementById('portfolio-performance-chart');
    
    if (portfolioCanvas) {
        drawPortfolioChart(portfolioCanvas);
    }
    
    if (performanceCanvas) {
        drawPerformanceChart(performanceCanvas);
    }
}

function drawPortfolioChart(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 200;
    
    // Simple line chart
    const data = [10, 15, 12, 20, 18, 25, 22, 28, 24, 30];
    const maxValue = Math.max(...data);
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (width - padding * 2) * (index / (data.length - 1)) + padding;
        const y = height - (height - padding * 2) * (value / maxValue) - padding;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add gradient fill
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
}

function drawPerformanceChart(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 250;
    
    // More detailed performance chart
    const data = [100, 105, 103, 110, 108, 115, 112, 120, 118, 125, 123, 130];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = (height - padding * 2) * (i / 5) + padding;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw main line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (width - padding * 2) * (index / (data.length - 1)) + padding;
        const y = height - ((value - minValue) / range) * (height - padding * 2) - padding;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add data points
    ctx.fillStyle = '#22c55e';
    data.forEach((value, index) => {
        const x = (width - padding * 2) * (index / (data.length - 1)) + padding;
        const y = height - ((value - minValue) / range) * (height - padding * 2) - padding;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Fraud Scanner Functionality
function initializeScanners() {
    const scanUrlBtn = document.getElementById('scan-url');
    const scanMessageBtn = document.getElementById('scan-message');
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('file-input');
    const scanResults = document.getElementById('scan-results');
    
    if (scanUrlBtn) {
        scanUrlBtn.addEventListener('click', function() {
            const url = document.getElementById('url-input').value;
            if (url) {
                scanURL(url);
            } else {
                showNotification('Please enter a URL to scan', 'warning');
            }
        });
    }
    
    if (scanMessageBtn) {
        scanMessageBtn.addEventListener('click', function() {
            const message = document.getElementById('message-input').value;
            if (message) {
                scanMessage(message);
            } else {
                showNotification('Please enter a message to scan', 'warning');
            }
        });
    }
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#22c55e';
        });
        
        fileUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        });
        
        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                scanFiles(files);
            }
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                scanFiles(this.files);
            }
        });
    }
    
    function scanURL(url) {
        showScanProgress('Scanning URL for threats...');
        
        setTimeout(() => {
            const isSafe = Math.random() > 0.3; // 70% chance it's safe
            const result = {
                type: 'URL',
                target: url,
                safe: isSafe,
                threats: isSafe ? [] : ['Potential phishing site', 'Suspicious domain age'],
                score: isSafe ? 95 : 25,
                recommendations: isSafe ? 
                    ['URL appears safe to visit', 'SSL certificate is valid'] : 
                    ['Do not visit this site', 'Report as phishing', 'Clear browser cache']
            };
            displayScanResult(result);
        }, 2000);
    }
    
    function scanMessage(message) {
        showScanProgress('Analyzing message for phishing attempts...');
        
        setTimeout(() => {
            const suspiciousKeywords = ['urgent', 'verify account', 'click here', 'suspended', 'winner'];
            const foundKeywords = suspiciousKeywords.filter(keyword => 
                message.toLowerCase().includes(keyword)
            );
            
            const isSafe = foundKeywords.length === 0;
            const result = {
                type: 'Message',
                target: message.substring(0, 50) + '...',
                safe: isSafe,
                threats: isSafe ? [] : [`Suspicious keywords found: ${foundKeywords.join(', ')}`],
                score: isSafe ? 90 : 30,
                recommendations: isSafe ? 
                    ['Message appears legitimate'] : 
                    ['Be cautious with this message', 'Verify sender through other means', 'Do not click any links']
            };
            displayScanResult(result);
        }, 1500);
    }
    
    function scanFiles(files) {
        showScanProgress(`Scanning ${files.length} file(s) for malware...`);
        
        setTimeout(() => {
            const results = Array.from(files).map(file => {
                const isSafe = Math.random() > 0.2; // 80% chance it's safe
                return {
                    type: 'File',
                    target: file.name,
                    safe: isSafe,
                    threats: isSafe ? [] : ['Potential malware detected', 'Suspicious file signature'],
                    score: isSafe ? 92 : 15,
                    recommendations: isSafe ? 
                        ['File appears clean'] : 
                        ['Quarantine this file', 'Run additional antivirus scan', 'Do not open']
                };
            });
            
            results.forEach(result => displayScanResult(result));
        }, 3000);
    }
    
    function showScanProgress(message) {
        const scanResults = document.getElementById('scan-results');
        if (scanResults) {
            scanResults.innerHTML = `
                <div class="scan-progress">
                    <div class="progress-spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            
            // Add CSS for spinner if not exists
            if (!document.getElementById('spinner-styles')) {
                const style = document.createElement('style');
                style.id = 'spinner-styles';
                style.textContent = `
                    .scan-progress {
                        text-align: center;
                        padding: 2rem;
                        background: rgba(30, 41, 59, 0.6);
                        border-radius: 12px;
                        margin-top: 1rem;
                    }
                    .progress-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(34, 197, 94, 0.2);
                        border-left: 4px solid #22c55e;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    function displayScanResult(result) {
        const scanResults = document.getElementById('scan-results');
        if (scanResults) {
            const resultElement = document.createElement('div');
            resultElement.className = `scan-result ${result.safe ? 'safe' : 'threat'}`;
            resultElement.innerHTML = `
                <div class="result-header">
                    <div class="result-icon">
                        <i class="fas ${result.safe ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                    </div>
                    <div class="result-info">
                        <h4>${result.type} Scan Result</h4>
                        <p>${result.target}</p>
                    </div>
                    <div class="result-score ${result.safe ? 'safe' : 'threat'}">
                        ${result.score}/100
                    </div>
                </div>
                <div class="result-details">
                    ${result.threats.length > 0 ? `
                        <div class="threats">
                            <h5>Threats Detected:</h5>
                            <ul>
                                ${result.threats.map(threat => `<li>${threat}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    <div class="recommendations">
                        <h5>Recommendations:</h5>
                        <ul>
                            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            scanResults.innerHTML = '';
            scanResults.appendChild(resultElement);
            
            // Add CSS for scan results if not exists
            if (!document.getElementById('scan-result-styles')) {
                const style = document.createElement('style');
                style.id = 'scan-result-styles';
                style.textContent = `
                    .scan-result {
                        background: rgba(30, 41, 59, 0.6);
                        border-radius: 12px;
                        padding: 1.5rem;
                        margin-top: 1rem;
                        border-left: 4px solid;
                    }
                    .scan-result.safe {
                        border-left-color: #22c55e;
                    }
                    .scan-result.threat {
                        border-left-color: #ef4444;
                    }
                    .result-header {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        margin-bottom: 1rem;
                    }
                    .result-icon {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                    }
                    .scan-result.safe .result-icon {
                        background: rgba(34, 197, 94, 0.2);
                        color: #22c55e;
                    }
                    .scan-result.threat .result-icon {
                        background: rgba(239, 68, 68, 0.2);
                        color: #ef4444;
                    }
                    .result-info h4 {
                        color: #f8fafc;
                        margin-bottom: 0.25rem;
                    }
                    .result-info p {
                        color: #94a3b8;
                        font-size: 0.9rem;
                    }
                    .result-score {
                        font-size: 1.25rem;
                        font-weight: 700;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                    }
                    .result-score.safe {
                        background: rgba(34, 197, 94, 0.2);
                        color: #22c55e;
                    }
                    .result-score.threat {
                        background: rgba(239, 68, 68, 0.2);
                        color: #ef4444;
                    }
                    .result-details h5 {
                        color: #f8fafc;
                        margin-bottom: 0.5rem;
                        font-size: 0.9rem;
                    }
                    .result-details ul {
                        list-style: none;
                        padding: 0;
                        margin-bottom: 1rem;
                    }
                    .result-details li {
                        color: #94a3b8;
                        font-size: 0.9rem;
                        padding: 0.25rem 0;
                        padding-left: 1.5rem;
                        position: relative;
                    }
                    .result-details li::before {
                        content: '•';
                        position: absolute;
                        left: 0.5rem;
                        color: #22c55e;
                    }
                    .threats li::before {
                        color: #ef4444;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
}

// Education Tab System
function initializeEducationTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
    
    // Course buttons
    const courseBtns = document.querySelectorAll('.course-btn');
    courseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('completed')) {
                showNotification('Starting course... Redirecting to learning platform', 'success');
                // Here you would typically redirect to the actual course
            }
        });
    });
}

// Challenge System
function initializeChallenges() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const challengeCards = document.querySelectorAll('.challenge-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all category buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter challenge cards
            challengeCards.forEach(card => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Life Simulator
function initializeLifeSimulator() {
    const optionBtns = document.querySelectorAll('.option-btn');
    const simBalance = document.getElementById('sim-balance');
    const simAge = document.getElementById('sim-age');
    const simHealth = document.getElementById('sim-health');
    const simSecurity = document.getElementById('sim-security');
    
    let gameState = {
        balance: 50000,
        age: 25,
        health: 100,
        security: 85
    };
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const choice = this.getAttribute('data-choice');
            handleSimulatorChoice(choice);
        });
    });
    
    function handleSimulatorChoice(choice) {
        let outcome = '';
        let balanceChange = 0;
        let securityChange = 0;
        let healthChange = 0;
        
        switch(choice) {
            case 'invest':
                const investmentOutcome = Math.random();
                if (investmentOutcome > 0.7) {
                    balanceChange = 5000;
                    outcome = 'Great choice! Your investment paid off. +$5,000';
                } else if (investmentOutcome > 0.3) {
                    balanceChange = -2000;
                    outcome = 'The investment didn\'t perform well. -$2,000';
                } else {
                    balanceChange = -10000;
                    securityChange = -10;
                    outcome = 'It was a scam! You lost money and your security was compromised.';
                }
                break;
            case 'research':
                balanceChange = 0;
                securityChange = 5;
                outcome = 'Smart move! You avoided a potential scam by researching first.';
                break;
            case 'decline':
                balanceChange = 0;
                securityChange = 2;
                outcome = 'Conservative choice. You kept your money safe.';
                break;
        }
        
        // Update game state
        gameState.balance += balanceChange;
        gameState.security = Math.max(0, Math.min(100, gameState.security + securityChange));
        gameState.health = Math.max(0, Math.min(100, gameState.health + healthChange));
        gameState.age += 0.1; // Age slightly with each decision
        
        // Update UI
        updateSimulatorStats();
        
        // Show outcome
        showNotification(outcome, balanceChange > 0 ? 'success' : balanceChange < 0 ? 'error' : 'info');
        
        // Generate new scenario after a delay
        setTimeout(generateNewScenario, 2000);
    }
    
    function updateSimulatorStats() {
        if (simBalance) simBalance.textContent = Math.floor(gameState.balance).toLocaleString();
        if (simAge) simAge.textContent = Math.floor(gameState.age);
        if (simHealth) simHealth.textContent = Math.floor(gameState.health);
        if (simSecurity) simSecurity.textContent = Math.floor(gameState.security);
    }
    
    function generateNewScenario() {
        const scenarios = [
            {
                title: 'Email from Bank',
                description: 'You receive an email claiming to be from your bank asking you to verify your account details. What do you do?',
                options: [
                    { text: 'Click the link immediately', choice: 'click' },
                    { text: 'Call the bank directly', choice: 'verify' },
                    { text: 'Delete the email', choice: 'delete' }
                ]
            },
            {
                title: 'Investment Seminar',
                description: 'A friend invites you to a "get rich quick" investment seminar. The speaker promises 50% returns in 30 days. What\'s your move?',
                options: [
                    { text: 'Invest immediately', choice: 'invest-quick' },
                    { text: 'Ask for documentation', choice: 'research-docs' },
                    { text: 'Politely decline', choice: 'decline-seminar' }
                ]
            },
            {
                title: 'Online Shopping',
                description: 'You find an amazing deal on a luxury item for 70% off on a website you\'ve never heard of. What do you do?',
                options: [
                    { text: 'Buy it immediately', choice: 'buy-deal' },
                    { text: 'Research the website first', choice: 'research-site' },
                    { text: 'Look for it elsewhere', choice: 'compare-prices' }
                ]
            }
        ];
        
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const scenarioCard = document.querySelector('.scenario-card');
        
        if (scenarioCard) {
            scenarioCard.innerHTML = `
                <h3>${randomScenario.title}</h3>
                <p>${randomScenario.description}</p>
                <div class="scenario-options">
                    ${randomScenario.options.map(option => 
                        `<button class="option-btn" data-choice="${option.choice}">${option.text}</button>`
                    ).join('')}
                </div>
            `;
            
            // Re-attach event listeners
            const newOptionBtns = scenarioCard.querySelectorAll('.option-btn');
            newOptionBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const choice = this.getAttribute('data-choice');
                    handleSimulatorChoice(choice);
                });
            });
        }
    }
}

// Notification System
function initializeNotifications() {
    // Security alerts simulation
    setTimeout(() => {
        showNotification('New security alert: Unusual login detected', 'warning');
    }, 5000);
    
    setTimeout(() => {
        showNotification('Portfolio update: Your investments are up 2.3% today', 'success');
    }, 10000);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            hideNotification(notification);
        }
    }, 5000);
}

function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-triangle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'linear-gradient(135deg, #22c55e, #16a34a)';
        case 'error': return 'linear-gradient(135deg, #ef4444, #dc2626)';
        case 'warning': return 'linear-gradient(135deg, #f59e0b, #d97706)';
        default: return 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                performSearch(query);
            }
        });
    }
}

function performSearch(query) {
    // Simple search implementation
    const searchableElements = document.querySelectorAll('[data-searchable]');
    let results = [];
    
    searchableElements.forEach(element => {
        if (element.textContent.toLowerCase().includes(query)) {
            results.push({
                element: element,
                section: element.closest('.content-section').id,
                text: element.textContent
            });
        }
    });
    
    if (results.length > 0) {
        showNotification(`Found ${results.length} results for "${query}"`, 'info');
    }
}

// Section-specific initialization
function initializeSectionFeatures(section) {
    switch(section) {
        case 'ai-advisor':
            initializeAIChat();
            break;
        case 'fraud-scanner':
            // Already initialized in initializeScanners
            break;
        case 'education':
            // Already initialized in initializeEducationTabs
            break;
        case 'life-simulator':
            // Already initialized in initializeLifeSimulator
            break;
        case 'challenges':
            // Already initialized in initializeChallenges
            break;
        case 'portfolio':
            // Reinitialize charts if needed
            setTimeout(() => {
                const performanceCanvas = document.getElementById('portfolio-performance-chart');
                if (performanceCanvas) {
                    drawPerformanceChart(performanceCanvas);
                }
            }, 100);
            break;
    }
}

// Security settings toggles
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' && e.target.closest('.setting-item')) {
        const settingName = e.target.closest('.setting-item').querySelector('h4').textContent;
        const isEnabled = e.target.checked;
        showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
    }
});

// Responsive sidebar handling
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 1024) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
});

console.log('🚀 FinSecure Dashboard Loaded Successfully!');
console.log('💡 Features: AI Assistant, Fraud Scanner, Education Hub, Life Simulator');
console.log('🔒 All security features are active and monitoring');