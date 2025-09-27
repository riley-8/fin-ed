// security.js - Security page interactive functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize security page components
    initSafeLinkScanner();
    initPhishingSimulator();
    initBreachChecker();
    initPasswordAnalyzer();
    updateSecurityScore();
});

// SafeLink Scanner functionality
function initSafeLinkScanner() {
    const scannerForm = document.querySelector('.scanner-form');
    const urlInput = document.getElementById('urlInput');
    const scanResults = document.getElementById('scanResults');
    
    if (scannerForm) {
        scannerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const url = urlInput.value.trim();
            if (!url) return;
            
            // Show loading state
            scanResults.innerHTML = '<div class="text-center"><div class="spinner"></div><p>Scanning URL...</p></div>';
            scanResults.classList.add('active');
            
            // Simulate API call with timeout
            setTimeout(() => {
                const result = scanURL(url);
                displayScanResult(result);
            }, 1500);
        });
    }
}

function scanURL(url) {
    // This is a simulation - in a real app, this would call a security API
    const suspiciousPatterns = [
        'login',
        'verify',
        'account',
        'secure',
        'bank',
        'paypal',
        'amazon',
        'facebook'
    ];
    
    const domainPatterns = [
        'free',
        'discount',
        'offer',
        'reward',
        'prize'
    ];
    
    const urlLower = url.toLowerCase();
    let riskScore = 0;
    let issues = [];
    
    // Check for suspicious keywords in path
    suspiciousPatterns.forEach(pattern => {
        if (urlLower.includes(pattern)) {
            riskScore += 10;
            issues.push(`Contains suspicious keyword: "${pattern}"`);
        }
    });
    
    // Check for suspicious domain patterns
    domainPatterns.forEach(pattern => {
        if (urlLower.includes(pattern)) {
            riskScore += 15;
            issues.push(`Suspicious domain pattern: "${pattern}"`);
        }
    });
    
    // Check for HTTPS
    if (!urlLower.startsWith('https://')) {
        riskScore += 20;
        issues.push('Connection is not secure (HTTP instead of HTTPS)');
    }
    
    // Check for IP address instead of domain
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    if (ipRegex.test(url)) {
        riskScore += 25;
        issues.push('Uses IP address instead of domain name');
    }
    
    // Check for excessive subdomains
    const subdomainCount = (url.match(/\./g) || []).length;
    if (subdomainCount > 3) {
        riskScore += 10;
        issues.push('Excessive number of subdomains');
    }
    
    // Determine risk level
    let riskLevel, riskColor, riskIcon;
    
    if (riskScore >= 60) {
        riskLevel = 'High Risk';
        riskColor = 'danger';
        riskIcon = 'fas fa-exclamation-triangle';
    } else if (riskScore >= 30) {
        riskLevel = 'Medium Risk';
        riskColor = 'warning';
        riskIcon = 'fas fa-exclamation-circle';
    } else {
        riskLevel = 'Low Risk';
        riskColor = 'success';
        riskIcon = 'fas fa-check-circle';
    }
    
    return {
        url,
        riskScore,
        riskLevel,
        riskColor,
        riskIcon,
        issues
    };
}

function displayScanResult(result) {
    const scanResults = document.getElementById('scanResults');
    
    let issuesHTML = '';
    if (result.issues.length > 0) {
        issuesHTML = '<ul class="mt-2">';
        result.issues.forEach(issue => {
            issuesHTML += `<li>${issue}</li>`;
        });
        issuesHTML += '</ul>';
    } else {
        issuesHTML = '<p class="mt-2">No security issues detected.</p>';
    }
    
    scanResults.innerHTML = `
        <div class="result-${result.riskColor}">
            <div class="result-header">
                <i class="${result.riskIcon}"></i>
                <span class="result-title">${result.riskLevel}</span>
            </div>
            <div class="result-details">
                <p>Security Score: ${100 - result.riskScore}/100</p>
                ${issuesHTML}
            </div>
        </div>
    `;
    
    scanResults.classList.add('active');
}

// Phishing Simulator functionality
function initPhishingSimulator() {
    const startButton = document.getElementById('startChallenge');
    const simulatorStage = document.getElementById('simulatorStage');
    const challengeScore = document.getElementById('challengeScore');
    const challengeRound = document.getElementById('challengeRound');
    
    let currentRound = 0;
    let score = 0;
    let phishingExamples = [];
    
    // Define phishing examples
    phishingExamples = [
        {
            type: 'phishing',
            content: `
                <div class="phishing-example">
                    <h4>Urgent: Your Account Needs Verification</h4>
                    <p>Dear Customer,</p>
                    <p>We've detected suspicious activity on your account. To avoid suspension, please verify your information immediately.</p>
                    <p><a href="#">Click here to verify your account</a></p>
                    <p>Best regards,<br>Your Bank Security Team</p>
                </div>
            `,
            explanation: 'This is a phishing attempt. Legitimate banks never ask for verification via email links.'
        },
        {
            type: 'legitimate',
            content: `
                <div class="phishing-example">
                    <h4>Monthly Statement Available</h4>
                    <p>Hello [Customer Name],</p>
                    <p>Your monthly account statement is now available. To view it, log in to your online banking account.</p>
                    <p>Please do not reply to this email. If you have questions, contact us through our secure messaging system.</p>
                    <p>Sincerely,<br>Your Bank</p>
                </div>
            `,
            explanation: 'This is a legitimate email. It directs you to log in to your account rather than clicking a link.'
        },
        {
            type: 'phishing',
            content: `
                <div class="phishing-example">
                    <h4>You've Won a $1000 Gift Card!</h4>
                    <p>Congratulations! You've been selected to receive a $1000 Amazon Gift Card.</p>
                    <p>Click the link below to claim your prize within the next 24 hours:</p>
                    <p><a href="#">Claim Your Prize Now</a></p>
                    <p>This is a limited time offer. Don't miss out!</p>
                </div>
            `,
            explanation: 'This is a phishing attempt. Unsolicited prize notifications are common scams.'
        },
        {
            type: 'legitimate',
            content: `
                <div class="phishing-example">
                    <h4>Security Notice: New Login Detected</h4>
                    <p>Hello,</p>
                    <p>We noticed a new login to your account from a unrecognized device.</p>
                    <p>If this was you, you can ignore this message. If this wasn't you, please secure your account immediately.</p>
                    <p>View recent activity in your security settings.</p>
                    <p>Thanks,<br>The Security Team</p>
                </div>
            `,
            explanation: 'This is a legitimate security notification. It doesn\'t ask you to click any links.'
        },
        {
            type: 'phishing',
            content: `
                <div class="phishing-example">
                    <h4>Invoice Payment Failed</h4>
                    <p>Your recent invoice payment could not be processed.</p>
                    <p>To avoid service interruption, please update your payment information immediately.</p>
                    <p><a href="#">Update Payment Method</a></p>
                    <p>If you have questions, contact our support team.</p>
                </div>
            `,
            explanation: 'This could be phishing. Always verify payment issues by logging into the service directly.'
        }
    ];
    
    if (startButton) {
        startButton.addEventListener('click', function() {
            currentRound = 0;
            score = 0;
            updateChallengeUI();
            startNextRound();
        });
    }
    
    function startNextRound() {
        if (currentRound >= phishingExamples.length) {
            endChallenge();
            return;
        }
        
        const example = phishingExamples[currentRound];
        simulatorStage.innerHTML = `
            ${example.content}
            <p>Is this email legitimate or a phishing attempt?</p>
            <div class="phishing-options">
                <button class="btn btn-outline" data-choice="legitimate">Legitimate</button>
                <button class="btn btn-outline" data-choice="phishing">Phishing</button>
            </div>
        `;
        
        // Add event listeners to choice buttons
        const choiceButtons = simulatorStage.querySelectorAll('[data-choice]');
        choiceButtons.forEach(button => {
            button.addEventListener('click', function() {
                checkAnswer(this.dataset.choice, example.type);
            });
        });
    }
    
    function checkAnswer(userChoice, correctType) {
        if (userChoice === correctType) {
            score += 20;
            showFeedback('Correct!', 'success');
        } else {
            showFeedback('Incorrect.', 'error');
        }
        
        currentRound++;
        updateChallengeUI();
        
        // Show explanation before next round
        const example = phishingExamples[currentRound - 1];
        setTimeout(() => {
            showExplanation(example.explanation);
        }, 1000);
    }
    
    function showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: var(--radius-md);
            z-index: 10;
        `;
        
        simulatorStage.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 1000);
    }
    
    function showExplanation(explanation) {
        simulatorStage.innerHTML = `
            <div class="explanation">
                <h4>Explanation</h4>
                <p>${explanation}</p>
                <button class="btn btn-primary" id="nextRound">Continue</button>
            </div>
        `;
        
        document.getElementById('nextRound').addEventListener('click', startNextRound);
    }
    
    function updateChallengeUI() {
        challengeScore.textContent = score;
        challengeRound.textContent = `${currentRound}/${phishingExamples.length}`;
    }
    
    function endChallenge() {
        let message, color;
        
        if (score >= 80) {
            message = 'Excellent! You have strong phishing detection skills.';
            color = 'success';
        } else if (score >= 60) {
            message = 'Good job! You have decent phishing detection skills but there\'s room for improvement.';
            color = 'warning';
        } else {
            message = 'You need to improve your phishing detection skills. Consider taking our security courses.';
            color = 'danger';
        }
        
        simulatorStage.innerHTML = `
            <div class="challenge-complete text-center">
                <h4>Challenge Complete!</h4>
                <p>Your score: <strong>${score}/100</strong></p>
                <p class="${color}">${message}</p>
                <button class="btn btn-primary" id="restartChallenge">Try Again</button>
            </div>
        `;
        
        document.getElementById('restartChallenge').addEventListener('click', function() {
            currentRound = 0;
            score = 0;
            updateChallengeUI();
            startNextRound();
        });
    }
}

// Data Breach Checker functionality
function initBreachChecker() {
    const breachForm = document.querySelector('.breach-form');
    const emailInput = document.getElementById('emailInput');
    const breachResults = document.getElementById('breachResults');
    
    if (breachForm) {
        breachForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (!email) return;
            
            // Show loading state
            breachResults.innerHTML = '<div class="text-center"><div class="spinner"></div><p>Checking for breaches...</p></div>';
            breachResults.classList.add('active');
            
            // Simulate API call with timeout
            setTimeout(() => {
                const result = checkBreaches(email);
                displayBreachResult(result);
            }, 2000);
        });
    }
}

function checkBreaches(email) {
    // This is a simulation - in a real app, this would call a breach database API
    const commonBreaches = [
        {
            name: 'Social Media Platform Breach (2020)',
            date: 'March 2020',
            dataCompromised: 'Email addresses, passwords, personal information'
        },
        {
            name: 'E-commerce Site Incident (2019)',
            date: 'July 2019',
            dataCompromised: 'Email addresses, purchase history'
        },
        {
            name: 'Gaming Service Breach (2018)',
            date: 'September 2018',
            dataCompromised: 'Email addresses, usernames'
        }
    ];
    
    // Simulate finding breaches for some emails
    const emailHash = simpleHash(email);
    const hasBreaches = emailHash % 3 !== 0; // 2/3 chance of having breaches
    
    return {
        email,
        hasBreaches,
        breaches: hasBreaches ? commonBreaches.slice(0, (emailHash % 3) + 1) : []
    };
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function displayBreachResult(result) {
    const breachResults = document.getElementById('breachResults');
    
    if (!result.hasBreaches) {
        breachResults.innerHTML = `
            <div class="result-success">
                <div class="result-header">
                    <i class="fas fa-check-circle"></i>
                    <span class="result-title">No Known Breaches</span>
                </div>
                <div class="result-details">
                    <p>Good news! We didn't find your email in any known data breaches.</p>
                    <p>Continue practicing good security habits to keep your information safe.</p>
                </div>
            </div>
        `;
    } else {
        let breachesHTML = '';
        result.breaches.forEach(breach => {
            breachesHTML += `
                <div class="breach-item">
                    <h5>${breach.name}</h5>
                    <p><strong>Date:</strong> ${breach.date}</p>
                    <p><strong>Data Compromised:</strong> ${breach.dataCompromised}</p>
                </div>
            `;
        });
        
        breachResults.innerHTML = `
            <div class="result-warning">
                <div class="result-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span class="result-title">Breaches Found</span>
                </div>
                <div class="result-details">
                    <p>We found your email in ${result.breaches.length} known data breach(es).</p>
                    <div class="breach-list">
                        ${breachesHTML}
                    </div>
                    <p class="mt-2"><strong>Recommendations:</strong></p>
                    <ul>
                        <li>Change passwords for any accounts using this email</li>
                        <li>Enable two-factor authentication where available</li>
                        <li>Use a password manager to create unique passwords</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    breachResults.classList.add('active');
}

// Password Analyzer functionality
function initPasswordAnalyzer() {
    const passwordInput = document.getElementById('passwordInput');
    const passwordFeedback = document.getElementById('passwordFeedback');
    const strengthFill = document.getElementById('strengthFill');
    const strengthLabel = document.getElementById('strengthLabel');
    const generateButton = document.getElementById('generatePassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            analyzePassword(this.value);
        });
    }
    
    if (generateButton) {
        generateButton.addEventListener('click', generateStrongPassword);
    }
}

function analyzePassword(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 12) {
        score += 25;
    } else if (password.length >= 8) {
        score += 15;
        feedback.push('Consider using a longer password (12+ characters)');
    } else {
        feedback.push('Password is too short. Use at least 8 characters.');
    }
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/[0-9]/.test(password)) score += 5;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;
    
    // Common patterns to avoid
    if (password.match(/(.)\1\1/)) {
        score -= 10;
        feedback.push('Avoid repeated characters (e.g., "aaa")');
    }
    
    if (/(123|abc|password|qwerty)/i.test(password)) {
        score -= 20;
        feedback.push('Avoid common sequences or dictionary words');
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    // Update UI
    updatePasswordStrengthUI(score, feedback);
}

function updatePasswordStrengthUI(score, feedback) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthLabel = document.getElementById('strengthLabel');
    const passwordFeedback = document.getElementById('passwordFeedback');
    
    // Update strength bar
    strengthFill.style.width = `${score}%`;
    
    // Update strength label and color
    let strengthText, strengthColor;
    
    if (score >= 80) {
        strengthText = 'Very Strong';
        strengthColor = '#10b981'; // green
    } else if (score >= 60) {
        strengthText = 'Strong';
        strengthColor = '#22c55e'; // light green
    } else if (score >= 40) {
        strengthText = 'Fair';
        strengthColor = '#eab308'; // yellow
    } else if (score >= 20) {
        strengthText = 'Weak';
        strengthColor = '#f59e0b'; // orange
    } else {
        strengthText = 'Very Weak';
        strengthColor = '#ef4444'; // red
    }
    
    strengthFill.style.backgroundColor = strengthColor;
    strengthLabel.textContent = strengthText;
    strengthLabel.style.color = strengthColor;
    
    // Update feedback
    if (feedback.length > 0) {
        passwordFeedback.innerHTML = '<ul>' + feedback.map(item => `<li>${item}</li>`).join('') + '</ul>';
    } else {
        passwordFeedback.innerHTML = '<p>Good password strength!</p>';
    }
}

function generateStrongPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    
    // Ensure at least one of each character type
    password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    password += getRandomChar('abcdefghijklmnopqrstuvwxyz');
    password += getRandomChar('0123456789');
    password += getRandomChar('!@#$%^&*()');
    
    // Fill the rest randomly
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    // Update the input field
    document.getElementById('passwordInput').value = password;
    
    // Analyze the generated password
    analyzePassword(password);
}

function getRandomChar(charSet) {
    return charSet.charAt(Math.floor(Math.random() * charSet.length));
}

// Security Score Update (simulated)
function updateSecurityScore() {
    // This would typically fetch real data from a backend
    // For demo purposes, we'll simulate some activity
    
    const scoreElement = document.querySelector('.score-number');
    const gaugeFill = document.querySelector('.gauge-fill');
    
    if (scoreElement && gaugeFill) {
        // Simulate a slight improvement in score
        const currentScore = parseInt(scoreElement.textContent);
        const newScore = Math.min(100, currentScore + 2); // Small improvement
        
        // Update the displayed score
        scoreElement.textContent = newScore;
        
        // Update the gauge visualization
        const circumference = 339.292; // 2 * π * 54
        const offset = circumference - (circumference * newScore / 100);
        gaugeFill.style.strokeDashoffset = offset;
        
        // Update breakdown values slightly
        updateBreakdownValues();
    }
}

function updateBreakdownValues() {
    const breakdownItems = document.querySelectorAll('.breakdown-fill');
    
    breakdownItems.forEach(item => {
        const currentWidth = parseInt(item.style.width);
        const newWidth = Math.min(100, currentWidth + Math.random() * 5);
        item.style.width = `${newWidth}%`;
        
        // Update the percentage text
        const valueElement = item.closest('li').querySelector('.breakdown-value');
        if (valueElement) {
            valueElement.textContent = `${Math.round(newWidth)}%`;
        }
    });
}