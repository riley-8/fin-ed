// investing.js - Interactive investing page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the investing page
    initInvestingPage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Generate initial portfolio recommendations
    generatePortfolioRecommendations();
    
    // Generate initial growth projections
    generateGrowthProjections();
});

// Initialize the investing page
function initInvestingPage() {
    // Set up mobile navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Initialize risk slider display
    updateRiskDisplay();
}

// Set up event listeners for interactive elements
function setupEventListeners() {
    // Risk slider
    const riskSlider = document.getElementById('riskSlider');
    if (riskSlider) {
        riskSlider.addEventListener('input', function() {
            updateRiskDisplay();
            generatePortfolioRecommendations();
        });
    }
    
    // Investment goals radio buttons
    const goalRadios = document.querySelectorAll('input[name="goal"]');
    goalRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            generatePortfolioRecommendations();
        });
    });
    
    // Time horizon select
    const timeHorizon = document.getElementById('timeHorizon');
    if (timeHorizon) {
        timeHorizon.addEventListener('change', function() {
            generatePortfolioRecommendations();
        });
    }
    
    // Ethical investing toggle
    const ethicalToggle = document.getElementById('ethicalToggle');
    if (ethicalToggle) {
        ethicalToggle.addEventListener('change', function() {
            generatePortfolioRecommendations();
        });
    }
    
    // Update portfolio button
    const updateButton = document.getElementById('updatePortfolio');
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            generatePortfolioRecommendations();
            generateGrowthProjections();
        });
    }
    
    // Projection years slider
    const projectionYears = document.getElementById('projectionYears');
    if (projectionYears) {
        projectionYears.addEventListener('input', function() {
            document.getElementById('yearsValue').textContent = `${this.value} years`;
            generateGrowthProjections();
        });
    }
    
    // Scenario toggle buttons
    const scenarioButtons = document.querySelectorAll('.scenario-toggle .btn');
    scenarioButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            scenarioButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            generateGrowthProjections();
        });
    });
}

// Update risk level display based on slider value
function updateRiskDisplay() {
    const riskSlider = document.getElementById('riskSlider');
    const riskLevel = document.getElementById('riskLevel');
    const riskScore = document.getElementById('riskScore');
    
    if (!riskSlider || !riskLevel || !riskScore) return;
    
    const value = parseInt(riskSlider.value);
    riskScore.textContent = `${value}/10`;
    
    // Determine risk level based on value
    if (value <= 3) {
        riskLevel.textContent = 'Conservative';
        riskLevel.style.color = '#10b981'; // Success color
    } else if (value <= 7) {
        riskLevel.textContent = 'Moderate';
        riskLevel.style.color = '#f59e0b'; // Warning color
    } else {
        riskLevel.textContent = 'Aggressive';
        riskLevel.style.color = '#ef4444'; // Danger color
    }
}

// Generate portfolio recommendations based on user inputs
function generatePortfolioRecommendations() {
    const riskValue = parseInt(document.getElementById('riskSlider').value);
    const goal = document.querySelector('input[name="goal"]:checked').value;
    const timeHorizon = document.getElementById('timeHorizon').value;
    const ethical = document.getElementById('ethicalToggle').checked;
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    
    // Determine risk profile
    let riskProfile;
    if (riskValue <= 3) riskProfile = 'conservative';
    else if (riskValue <= 7) riskProfile = 'moderate';
    else riskProfile = 'aggressive';
    
    // Generate portfolio options based on risk profile and other factors
    const portfolios = generatePortfolioOptions(riskProfile, goal, timeHorizon, ethical);
    
    // Display portfolio cards
    displayPortfolioCards(portfolios, riskProfile);
    
    // Generate comparison chart
    generateComparisonChart(portfolios, initialInvestment, monthlyContribution);
}

// Generate portfolio options based on user preferences
function generatePortfolioOptions(riskProfile, goal, timeHorizon, ethical) {
    // Base portfolios for different risk profiles
    const basePortfolios = {
        conservative: {
            name: 'Conservative Growth',
            description: 'Focus on capital preservation with steady, low-risk returns',
            allocation: {
                'Bonds': 60,
                'Large Cap Stocks': 25,
                'International Stocks': 10,
                'Cash': 5
            },
            expectedReturn: 4.5,
            maxDrawdown: -8,
            volatility: 'Low'
        },
        moderate: {
            name: 'Balanced Portfolio',
            description: 'Balance between growth and stability with moderate risk',
            allocation: {
                'Large Cap Stocks': 45,
                'Bonds': 35,
                'International Stocks': 15,
                'Real Estate': 5
            },
            expectedReturn: 6.8,
            maxDrawdown: -15,
            volatility: 'Medium'
        },
        aggressive: {
            name: 'Growth Focused',
            description: 'Maximize long-term growth with higher risk tolerance',
            allocation: {
                'Large Cap Stocks': 50,
                'Small Cap Stocks': 20,
                'International Stocks': 20,
                'Emerging Markets': 10
            },
            expectedReturn: 9.2,
            maxDrawdown: -25,
            volatility: 'High'
        }
    };
    
    // Adjust based on investment goal
    if (goal === 'retirement') {
        // More diversified for retirement
        basePortfolios.conservative.allocation['Dividend Stocks'] = 10;
        basePortfolios.conservative.allocation['Bonds'] = 50;
        
        basePortfolios.moderate.allocation['Dividend Stocks'] = 10;
        basePortfolios.moderate.allocation['Large Cap Stocks'] = 35;
    } else if (goal === 'education') {
        // More growth-oriented for education (typically medium-term)
        basePortfolios.conservative.expectedReturn += 0.5;
        basePortfolios.moderate.expectedReturn += 0.7;
    } else if (goal === 'wealth') {
        // Maximum growth for wealth building
        basePortfolios.aggressive.allocation['Small Cap Stocks'] += 5;
        basePortfolios.aggressive.allocation['Large Cap Stocks'] -= 5;
        basePortfolios.aggressive.expectedReturn += 0.5;
    }
    
    // Adjust based on time horizon
    if (timeHorizon === 'short') {
        // More conservative for short-term
        Object.keys(basePortfolios).forEach(profile => {
            basePortfolios[profile].allocation['Cash'] = (basePortfolios[profile].allocation['Cash'] || 0) + 10;
            basePortfolios[profile].allocation['Bonds'] = Math.max(0, (basePortfolios[profile].allocation['Bonds'] || 0) - 5);
            basePortfolios[profile].allocation['Stocks'] = Math.max(0, (basePortfolios[profile].allocation['Stocks'] || 0) - 5);
        });
    } else if (timeHorizon === 'long') {
        // More aggressive for long-term
        Object.keys(basePortfolios).forEach(profile => {
            basePortfolios[profile].allocation['Stocks'] = (basePortfolios[profile].allocation['Stocks'] || 0) + 5;
            basePortfolios[profile].allocation['Bonds'] = Math.max(0, (basePortfolios[profile].allocation['Bonds'] || 0) - 5);
        });
    }
    
    // Adjust for ethical investing preference
    if (ethical) {
        Object.keys(basePortfolios).forEach(profile => {
            // Replace some allocations with ESG options
            if (basePortfolios[profile].allocation['Large Cap Stocks'] > 0) {
                basePortfolios[profile].allocation['ESG Stocks'] = Math.floor(basePortfolios[profile].allocation['Large Cap Stocks'] * 0.3);
                basePortfolios[profile].allocation['Large Cap Stocks'] -= basePortfolios[profile].allocation['ESG Stocks'];
            }
            
            if (basePortfolios[profile].allocation['Bonds'] > 0) {
                basePortfolios[profile].allocation['Green Bonds'] = Math.floor(basePortfolios[profile].allocation['Bonds'] * 0.4);
                basePortfolios[profile].allocation['Bonds'] -= basePortfolios[profile].allocation['Green Bonds'];
            }
            
            // Add sustainable real estate if not already present
            if (!basePortfolios[profile].allocation['Real Estate'] && basePortfolios[profile].allocation['Bonds'] > 5) {
                basePortfolios[profile].allocation['Sustainable REITs'] = 5;
                basePortfolios[profile].allocation['Bonds'] -= 5;
            }
            
            // Update description to reflect ethical focus
            basePortfolios[profile].name += ' (ESG)';
            basePortfolios[profile].description += ' with focus on sustainable and ethical investments';
        });
    }
    
    // Return all three portfolios for comparison
    return [
        { ...basePortfolios.conservative, risk: 'conservative' },
        { ...basePortfolios.moderate, risk: 'moderate' },
        { ...basePortfolios.aggressive, risk: 'aggressive' }
    ];
}

// Display portfolio cards in the UI
function displayPortfolioCards(portfolios, userRiskProfile) {
    const container = document.getElementById('portfolioCards');
    if (!container) return;
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Create a card for each portfolio
    portfolios.forEach((portfolio, index) => {
        const isRecommended = portfolio.risk === userRiskProfile;
        
        const card = document.createElement('article');
        card.className = `portfolio-card ${isRecommended ? 'recommended' : ''}`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Create risk dots visualization
        const riskDots = Array(10).fill(0).map((_, i) => 
            `<span class="risk-dot ${i < getRiskLevel(portfolio.risk) ? 'active' : ''}"></span>`
        ).join('');
        
        // Create allocation items
        const allocationItems = Object.entries(portfolio.allocation).map(([name, percentage]) => {
            const color = getAllocationColor(name);
            return `
                <div class="allocation-item">
                    <div class="allocation-name">
                        <span class="allocation-color" style="background: ${color}; width: 12px; height: 12px; border-radius: 50%; display: inline-block;"></span>
                        <span>${name}</span>
                    </div>
                    <span>${percentage}%</span>
                </div>
                <div class="allocation-bar">
                    <div class="allocation-fill" style="width: ${percentage}%; background: ${color};"></div>
                </div>
            `;
        }).join('');
        
        card.innerHTML = `
            <header class="portfolio-header">
                <h3 class="portfolio-name">${portfolio.name}</h3>
                <div class="portfolio-risk">
                    <span>Risk:</span>
                    <div class="risk-dots">${riskDots}</div>
                </div>
            </header>
            <p>${portfolio.description}</p>
            <section class="portfolio-allocation">
                <h4>Asset Allocation</h4>
                ${allocationItems}
            </section>
            <section class="portfolio-stats">
                <div class="stat-item">
                    <div class="stat-value">${portfolio.expectedReturn}%</div>
                    <div class="stat-label">Expected Return</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${portfolio.maxDrawdown}%</div>
                    <div class="stat-label">Max Drawdown</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${portfolio.volatility}</div>
                    <div class="stat-label">Volatility</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${getDiversificationScore(portfolio.allocation)}/10</div>
                    <div class="stat-label">Diversification</div>
                </div>
            </section>
            <button class="btn ${isRecommended ? 'btn-primary' : 'btn-outline'} w-100">${isRecommended ? 'Select This Portfolio' : 'View Details'}</button>
        `;
        
        container.appendChild(card);
    });
}

// Generate comparison chart for portfolio performance
function generateComparisonChart(portfolios, initialInvestment, monthlyContribution) {
    const container = document.getElementById('comparisonChart');
    if (!container) return;
    
    // Clear previous chart
    container.innerHTML = '<canvas id="portfolioComparisonChart"></canvas>';
    
    // In a real implementation, we would use a charting library like Chart.js
    // For this demo, we'll create a simple SVG-based visualization
    
    const canvas = document.getElementById('portfolioComparisonChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = container.clientWidth;
    const height = canvas.height = 300;
    
    // Draw a simple bar chart comparing expected returns
    const barWidth = 60;
    const barSpacing = 30;
    const startX = 80;
    const maxReturn = Math.max(...portfolios.map(p => p.expectedReturn));
    const scale = (height - 100) / maxReturn;
    
    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 20);
    ctx.lineTo(70, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= maxReturn; i += 2) {
        const y = height - 30 - i * scale;
        ctx.fillText(i + '%', 65, y + 4);
        ctx.beginPath();
        ctx.moveTo(70, y);
        ctx.lineTo(75, y);
        ctx.stroke();
    }
    
    // Draw bars for each portfolio
    portfolios.forEach((portfolio, index) => {
        const x = startX + index * (barWidth + barSpacing);
        const barHeight = portfolio.expectedReturn * scale;
        const y = height - 30 - barHeight;
        
        // Choose color based on risk level
        let color;
        switch(portfolio.risk) {
            case 'conservative': color = '#10b981'; break;
            case 'moderate': color = '#f59e0b'; break;
            case 'aggressive': color = '#ef4444'; break;
            default: color = '#3b82f6';
        }
        
        // Draw bar
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw portfolio name below bar
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(portfolio.risk.charAt(0).toUpperCase() + portfolio.risk.slice(1), x + barWidth/2, height - 10);
        
        // Draw value on top of bar
        ctx.fillStyle = '#333';
        ctx.fillText(portfolio.expectedReturn + '%', x + barWidth/2, y - 5);
    });
    
    // Add chart title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Expected Annual Returns by Portfolio', width/2, 15);
}

// Generate growth projections based on user inputs
function generateGrowthProjections() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const years = parseInt(document.getElementById('projectionYears').value);
    const scenario = document.querySelector('.scenario-toggle .btn.active').dataset.scenario;
    
    const container = document.getElementById('projectionChart');
    if (!container) return;
    
    // Clear previous chart
    container.innerHTML = '<canvas id="growthProjectionChart"></canvas>';
    
    const canvas = document.getElementById('growthProjectionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = container.clientWidth;
    const height = canvas.height = 300;
    
    // Determine returns based on scenario
    let annualReturn, volatility;
    switch(scenario) {
        case 'optimistic':
            annualReturn = 0.10; // 10%
            volatility = 0.15;
            break;
        case 'moderate':
            annualReturn = 0.07; // 7%
            volatility = 0.10;
            break;
        case 'conservative':
            annualReturn = 0.04; // 4%
            volatility = 0.05;
            break;
        default:
            annualReturn = 0.07;
            volatility = 0.10;
    }
    
    // Calculate projection data
    const data = [];
    let currentValue = initialInvestment;
    
    for (let year = 0; year <= years; year++) {
        if (year > 0) {
            // Add monthly contributions for the year
            currentValue += monthlyContribution * 12;
            // Apply annual return with some randomness for realism
            const randomFactor = 1 + (Math.random() - 0.5) * volatility;
            currentValue *= (1 + annualReturn * randomFactor);
        }
        
        data.push({
            year: year,
            value: currentValue
        });
    }
    
    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value));
    const scale = (height - 60) / maxValue;
    const xScale = (width - 100) / years;
    
    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    // Format currency values
    const formatCurrency = (value) => {
        if (value >= 1000000) return '$' + (value/1000000).toFixed(1) + 'M';
        if (value >= 1000) return '$' + (value/1000).toFixed(0) + 'K';
        return '$' + value.toFixed(0);
    };
    
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
        const value = (maxValue / steps) * i;
        const y = height - 40 - value * scale;
        ctx.fillText(formatCurrency(value), 45, y + 4);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(55, y);
        ctx.stroke();
    }
    
    // Draw X-axis labels (years)
    ctx.textAlign = 'center';
    for (let year = 0; year <= years; year += Math.ceil(years/5)) {
        const x = 50 + year * xScale;
        ctx.fillText('Year ' + year, x, height - 20);
    }
    
    // Draw projection line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = 50 + point.year * xScale;
        const y = height - 40 - point.value * scale;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#3b82f6';
    data.forEach(point => {
        const x = 50 + point.year * xScale;
        const y = height - 40 - point.value * scale;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Add chart title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Projected Growth (${scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario)`, width/2, 15);
    
    // Display final value
    const finalValue = data[data.length - 1].value;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Projected Value: ${formatCurrency(finalValue)}`, width/2, height - 5);
}

// Helper function to get risk level as a number (1-10)
function getRiskLevel(riskProfile) {
    switch(riskProfile) {
        case 'conservative': return 3;
        case 'moderate': return 6;
        case 'aggressive': return 9;
        default: return 5;
    }
}

// Helper function to get color for allocation types
function getAllocationColor(allocationType) {
    const colors = {
        'Bonds': '#10b981',
        'Large Cap Stocks': '#3b82f6',
        'International Stocks': '#f59e0b',
        'Cash': '#6b7280',
        'Real Estate': '#ef4444',
        'Small Cap Stocks': '#8b5cf6',
        'Emerging Markets': '#f97316',
        'Dividend Stocks': '#06b6d4',
        'ESG Stocks': '#84cc16',
        'Green Bonds': '#22c55e',
        'Sustainable REITs': '#14b8a6'
    };
    
    return colors[allocationType] || '#6b7280';
}

// Helper function to calculate diversification score
function getDiversificationScore(allocation) {
    // Simple diversification score based on number of asset classes and distribution
    const assetCount = Object.keys(allocation).length;
    const evenDistribution = Object.values(allocation).reduce((sum, percent) => {
        return sum + Math.min(percent, 100/assetCount);
    }, 0) / 100;
    
    // Score from 1-10 based on diversification
    return Math.min(10, Math.floor(assetCount * 1.5 + evenDistribution * 3));
}