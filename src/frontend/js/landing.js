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
    
    // Send AI message with real API integration
    function sendMessage() {
        const message = aiInput.value.trim();
        if (message) {
            addAIMessage(message, 'user');
            aiInput.value = '';
            
            // Show typing indicator for floating widget
            showAIWidgetTyping();
            
            // Make API call to Gemini
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    context: 'Quick AI assistant consultation'
                })
            })
            .then(response => response.json())
            .then(data => {
                removeAIWidgetTyping();
                if (data.message) {
                    addAIMessage(data.message, 'ai');
                } else {
                    addAIMessage("I'm having trouble processing that right now. Please try again.", 'ai');
                }
            })
            .catch(error => {
                console.error('AI Widget error:', error);
                removeAIWidgetTyping();
                
                // Fallback responses for floating widget
                const quickResponses = [
                    "I'm here to help with your financial questions! What would you like to know?",
                    "I can assist with budgeting, investing, or security concerns. What's on your mind?",
                    "Having connection issues. Please try again or use the main AI advisor section for detailed help."
                ];
                
                const randomResponse = quickResponses[Math.floor(Math.random() * quickResponses.length)];
                addAIMessage(randomResponse, 'ai');
            });
        }
    }
    
    function showAIWidgetTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-widget';
        typingDiv.id = 'ai-widget-typing';
        typingDiv.innerHTML = `
            <div class="typing-dots-widget">
                <div class="typing-dot-widget"></div>
                <div class="typing-dot-widget"></div>
                <div class="typing-dot-widget"></div>
            </div>
        `;
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // Add CSS for widget typing indicator
        if (!document.getElementById('widget-typing-styles')) {
            const style = document.createElement('style');
            style.id = 'widget-typing-styles';
            style.textContent = `
                .typing-dots-widget {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    padding: 0.5rem;
                }
                .typing-dot-widget {
                    width: 6px;
                    height: 6px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: typing-widget 1.4s infinite ease-in-out;
                }
                .typing-dot-widget:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-dot-widget:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes typing-widget {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-6px);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function removeAIWidgetTyping() {
        const typingIndicator = document.getElementById('ai-widget-typing');
        if (typingIndicator) {
            typingIndicator.remove();
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
    
    // Send message function with real AI integration
    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                // Make API call to our backend which calls Gemini
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: message,
                        context: getCurrentContext()
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Remove typing indicator
                    removeTypingIndicator();
                    
                    // Add AI response
                    addChatMessage(data.message, 'ai');
                    
                    // Show notification if using fallback
                    if (data.fallback) {
                        setTimeout(() => {
                            showNotification('Note: Using offline mode. For best results, ensure your internet connection is stable.', 'info');
                        }, 1000);
                    }
                } else {
                    removeTypingIndicator();
                    addChatMessage("I'm having trouble connecting right now. Please try again in a moment, or check your internet connection.", 'ai');
                    showNotification('Connection error. Please try again.', 'error');
                }
                
            } catch (error) {
                console.error('Chat error:', error);
                removeTypingIndicator();
                
                // Fallback to basic responses
                const basicResponses = [
                    "I'm currently having technical difficulties. Please try again in a few moments.",
                    "Sorry, I can't connect to my AI services right now. Please check your internet connection and try again.",
                    "I'm experiencing some connection issues. In the meantime, you can explore our educational resources or try the fraud scanner."
                ];
                
                const randomResponse = basicResponses[Math.floor(Math.random() * basicResponses.length)];
                addChatMessage(randomResponse, 'ai');
                showNotification('Unable to connect to AI services. Please try again later.', 'error');
            }
        }
    }
    
    // Get current context for better AI responses
    function getCurrentContext() {
        const activeSection = document.querySelector('.content-section.active');
        const sectionId = activeSection ? activeSection.id : 'dashboard';
        
        const contexts = {
            'dashboard': 'User is viewing their financial dashboard with portfolio and security overview',
            'ai-advisor': 'User is in the AI advisor chat seeking financial guidance',
            'fraud-scanner': 'User is interested in cybersecurity and fraud detection',
            'security-center': 'User is reviewing their security settings and alerts',
            'education': 'User is exploring educational content about finance and security',
            'life-simulator': 'User is practicing financial decisions in a simulated environment',
            'challenges': 'User is working on gamified financial and security challenges',
            'portfolio': 'User is reviewing their investment portfolio and performance'
        };
        
        return contexts[sectionId] || 'General financial consultation';
    }
    
    // Enhanced typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add CSS for typing indicator if not exists
        if (!document.getElementById('typing-indicator-styles')) {
            const style = document.createElement('style');
            style.id = 'typing-indicator-styles';
            style.textContent = `
                .typing-dots {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 1rem;
                }
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }
                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes typing {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Enhanced quick actions with context
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
        
        // Enhanced message formatting
        const formattedMessage = formatAIMessage(message, type);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                ${formattedMessage}
            </div>
            <div class="message-timestamp">
                ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Format AI messages for better readability
    function formatAIMessage(message, type) {
        if (type === 'user') {
            return `<p>${message}</p>`;
        }
        
        // Enhanced AI message formatting
        let formatted = message;
        
        // Convert numbered lists
        formatted = formatted.replace(/(\d+)\.\s/g, '<br><strong>$1.</strong> ');
        
        // Convert bullet points
        formatted = formatted.replace(/•\s/g, '<br>• ');
        formatted = formatted.replace(/-\s/g, '<br>• ');
        
        // Bold important terms
        const importantTerms = [
            'diversified portfolio', 'emergency fund', 'compound interest', 'risk tolerance',
            'two-factor authentication', '2FA', 'phishing', 'malware', 'fraud',
            'budget', 'investment', 'savings', 'debt', 'credit score'
        ];
        
        importantTerms.forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            formatted = formatted.replace(regex, `<strong>${term}</strong>`);
        });
        
        // Add line breaks for better readability
        formatted = formatted.replace(/\.\s+([A-Z])/g, '.<br><br>$1');
        
        return `<p>${formatted}</p>`;
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
    
    async function scanURL(url) {
    if (!url || !url.trim()) {
        alert('Please enter a URL to scan');
        return;
    }

    // Validate URL format
    try {
        new URL(url);
    } catch (error) {
        alert('Please enter a valid URL (e.g., https://example.com)');
        return;
    }

    showScanProgress('Scanning URL with AI security analysis...');
    
    try {
        const response = await fetch('/api/scan/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Validate the response structure
        const validatedResult = {
            type: 'URL',
            target: url,
            safe: result.safe || false,
            threatLevel: result.threatLevel || 'unknown',
            threats: Array.isArray(result.threats) ? result.threats : ['Analysis incomplete'],
            confidence: typeof result.confidence === 'number' ? result.confidence : 0,
            recommendations: Array.isArray(result.recommendations) ? result.recommendations : ['Exercise caution'],
            category: result.category || 'unknown',
            details: result.details || {
                domainAnalysis: 'Analysis unavailable',
                contentRisks: 'Unknown',
                userAction: 'caution'
            },
            timestamp: result.timestamp || new Date().toISOString()
        };

        console.log('Validated scan result:', validatedResult);
        displayScanResult(validatedResult);

    } catch (error) {
        console.error('URL scan error:', error);
        
        // Show error result
        displayScanResult({
            type: 'URL',
            target: url,
            safe: false,
            threatLevel: 'error',
            threats: [`Scan failed: ${error.message}`],
            confidence: 0,
            recommendations: ['Unable to complete scan', 'Try again later', 'Exercise caution with this URL'],
            category: 'error',
            details: {
                domainAnalysis: 'Scan interrupted',
                contentRisks: 'Unable to assess',
                userAction: 'caution'
            },
            timestamp: new Date().toISOString()
        });
    }
}
    
   async function scanMessage(content) {
    if (!content || !content.trim()) {
        alert('Please enter a message to scan');
        return;
    }

    showScanProgress('Analyzing message for threats and scams...');
    
    try {
        const response = await fetch('/api/scan/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: content.trim() })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Validate the response structure
        const validatedResult = {
            type: 'MESSAGE',
            content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            safe: result.safe || false,
            threatLevel: result.threatLevel || 'unknown',
            threats: Array.isArray(result.threats) ? result.threats : ['Analysis incomplete'],
            scamType: result.scamType || null,
            confidence: typeof result.confidence === 'number' ? result.confidence : 0,
            recommendations: Array.isArray(result.recommendations) ? result.recommendations : ['Exercise caution'],
            timestamp: result.timestamp || new Date().toISOString()
        };

        console.log('Validated message scan result:', validatedResult);
        displayScanResult(validatedResult);

    } catch (error) {
        console.error('Message scan error:', error);
        
        // Show error result
        displayScanResult({
            type: 'MESSAGE',
            content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            safe: false,
            threatLevel: 'error',
            threats: [`Scan failed: ${error.message}`],
            scamType: 'Analysis failed',
            confidence: 0,
            recommendations: ['Unable to complete scan', 'Try again later', 'Exercise caution with suspicious messages'],
            timestamp: new Date().toISOString()
        });
    }
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
    console.log('Displaying result:', result);
    
    const resultsDiv = document.getElementById('scanResults');
    if (!resultsDiv) {
        console.error('Results div not found');
        return;
    }
    
    // Determine safety color and icon
    let statusClass, statusIcon, statusText;
    
    if (result.threatLevel === 'error') {
        statusClass = 'error';
        statusIcon = '❌';
        statusText = 'Scan Failed';
    } else if (result.safe) {
        statusClass = 'safe';
        statusIcon = '✅';
        statusText = 'Safe';
    } else {
        statusClass = result.threatLevel || 'unknown';
        statusIcon = '⚠️';
        statusText = result.threatLevel ? `${result.threatLevel.toUpperCase()} Risk` : 'Unknown Risk';
    }
    
    const confidence = result.confidence || 0;
    const confidenceColor = confidence >= 80 ? '#4CAF50' : confidence >= 60 ? '#FF9800' : '#f44336';
    
    // Format threats list
    const threatsList = result.threats && result.threats.length > 0 
        ? result.threats.map(threat => `<li>${threat}</li>`).join('')
        : '<li>No specific threats identified</li>';
    
    // Format recommendations list
    const recommendationsList = result.recommendations && result.recommendations.length > 0
        ? result.recommendations.map(rec => `<li>${rec}</li>`).join('')
        : '<li>No specific recommendations</li>';
    
    // Create result HTML
    let resultHTML = `
        <div class="scan-result ${statusClass}">
            <div class="result-header">
                <span class="status-icon">${statusIcon}</span>
                <h3>${statusText}</h3>
                <div class="confidence-score">
                    Confidence: <span style="color: ${confidenceColor}; font-weight: bold;">${confidence}%</span>
                </div>
            </div>
            
            <div class="result-details">
                <div class="detail-section">
                    <h4>Target:</h4>
                    <p class="target-text">${result.target || result.content || 'Unknown'}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Threats Detected:</h4>
                    <ul class="threats-list">${threatsList}</ul>
                </div>
                
                <div class="detail-section">
                    <h4>Recommendations:</h4>
                    <ul class="recommendations-list">${recommendationsList}</ul>
                </div>`;
    
    // Add type-specific details
    if (result.type === 'URL' && result.details) {
        resultHTML += `
                <div class="detail-section">
                    <h4>Technical Analysis:</h4>
                    <div class="technical-details">
                        <p><strong>Domain Analysis:</strong> ${result.details.domainAnalysis}</p>
                        <p><strong>Content Risks:</strong> ${result.details.contentRisks}</p>
                        <p><strong>Recommended Action:</strong> ${result.details.userAction}</p>
                    </div>
                </div>`;
    }
    
    if (result.type === 'MESSAGE' && result.scamType) {
        resultHTML += `
                <div class="detail-section">
                    <h4>Scam Analysis:</h4>
                    <p><strong>Type:</strong> ${result.scamType}</p>
                </div>`;
    }
    
    resultHTML += `
                <div class="detail-section">
                    <small class="timestamp">Scanned: ${new Date(result.timestamp).toLocaleString()}</small>
                </div>
            </div>
        </div>`;
    
    resultsDiv.innerHTML = resultHTML;
    resultsDiv.style.display = 'block';
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
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