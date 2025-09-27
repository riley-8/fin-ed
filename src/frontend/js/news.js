// news.js - News page functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.querySelector('.news-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const regionSelect = document.getElementById('regionSelect');
    const featuredAlert = document.getElementById('featuredAlert');
    const scanAlertLinkBtn = document.getElementById('scanAlertLink');
    const dismissAlertBtn = document.getElementById('dismissAlert');
    const trendingList = document.getElementById('trendingList');
    const phishingStat = document.getElementById('phishingStat');
    const phishingValue = document.getElementById('phishingValue');
    const investmentStat = document.getElementById('investmentStat');
    const investmentValue = document.getElementById('investmentValue');
    const identityStat = document.getElementById('identityStat');
    const identityValue = document.getElementById('identityValue');
    const quickScanInput = document.getElementById('quickScanInput');
    const quickScanBtn = document.getElementById('quickScanBtn');
    const scanResult = document.getElementById('scanResult');
    const refreshNewsBtn = document.getElementById('refreshNews');
    const loadingState = document.getElementById('loadingState');
    const newsGrid = document.getElementById('newsGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const insightsGrid = document.getElementById('insightsGrid');
    
    // State variables
    let currentCategory = 'all';
    let currentRegion = 'global';
    let currentSearchTerm = '';
    let currentPage = 1;
    let articles = [];
    let filteredArticles = [];
    let articlesPerPage = 6;
    
    // Initialize the page
    init();
    
    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Load initial data
        loadTrendingTopics();
        updateScamStatistics();
        loadFeaturedAlert();
        loadNewsArticles();
        generateAIInsights();
    }
    
    function setupEventListeners() {
        // Mobile navigation toggle
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Search functionality
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            currentSearchTerm = searchInput.value.trim();
            currentPage = 1;
            filterArticles();
        });
        
        // Category filters
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update category and filter articles
                currentCategory = this.dataset.category;
                currentPage = 1;
                filterArticles();
            });
        });
        
        // Region selector
        regionSelect.addEventListener('change', function() {
            currentRegion = this.value;
            updateScamStatistics();
            loadFeaturedAlert();
            filterArticles();
        });
        
        // Alert actions
        if (scanAlertLinkBtn) {
            scanAlertLinkBtn.addEventListener('click', function() {
                scanAlertLinks();
            });
        }
        
        if (dismissAlertBtn) {
            dismissAlertBtn.addEventListener('click', function() {
                featuredAlert.style.display = 'none';
            });
        }
        
        // Quick scanner
        quickScanBtn.addEventListener('click', function() {
            const url = quickScanInput.value.trim();
            if (url) {
                scanUrl(url);
            } else {
                showScanResult('Please enter a URL to scan.', 'warning');
            }
        });
        
        // Refresh news
        refreshNewsBtn.addEventListener('click', function() {
            currentPage = 1;
            loadNewsArticles();
        });
        
        // Load more articles
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            displayArticles();
        });
    }
    
    function loadTrendingTopics() {
        // Simulate API call to get trending topics
        const trendingTopics = [
            { tag: 'Finance', topic: 'Cryptocurrency regulations', count: 142 },
            { tag: 'Security', topic: 'Phishing attacks increase', count: 98 },
            { tag: 'Scam Alerts', topic: 'New investment scam', count: 76 },
            { tag: 'Sustainability', topic: 'Green investing trends', count: 64 },
            { tag: 'Finance', topic: 'Interest rate changes', count: 53 }
        ];
        
        // Clear existing list
        trendingList.innerHTML = '';
        
        // Populate trending topics
        trendingTopics.forEach(topic => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="trend-tag">${topic.tag}</span>
                <span>${topic.topic}</span>
                <small>${topic.count} mentions</small>
            `;
            
            listItem.addEventListener('click', function() {
                searchInput.value = topic.topic;
                currentSearchTerm = topic.topic;
                currentPage = 1;
                filterArticles();
            });
            
            trendingList.appendChild(listItem);
        });
    }
    
    function updateScamStatistics() {
        // Simulate region-specific scam statistics
        const stats = {
            'global': { phishing: 65, investment: 42, identity: 38 },
            'south-africa': { phishing: 72, investment: 58, identity: 45 },
            'europe': { phishing: 48, investment: 35, identity: 29 },
            'north-america': { phishing: 59, investment: 51, identity: 41 },
            'asia': { phishing: 68, investment: 47, identity: 52 }
        };
        
        const regionStats = stats[currentRegion] || stats.global;
        
        // Update progress bars with animation
        animateProgress(phishingStat, regionStats.phishing, phishingValue);
        animateProgress(investmentStat, regionStats.investment, investmentValue);
        animateProgress(identityStat, regionStats.identity, identityValue);
    }
    
    function animateProgress(progressElement, value, valueElement) {
        let current = 0;
        const increment = value / 50; // Animate over 50 steps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                current = value;
                clearInterval(timer);
            }
            
            progressElement.value = current;
            valueElement.textContent = Math.round(current) + '%';
        }, 20);
    }
    
    function loadFeaturedAlert() {
        // Simulate fetching a critical security alert
        const alerts = {
            'global': {
                title: 'Global Phishing Campaign Targeting Financial Institutions',
                content: 'A sophisticated phishing campaign is targeting customers of major banks worldwide. The emails appear to be from legitimate financial institutions and contain links to fake login pages.',
                time: '2 hours ago',
                severity: 'critical'
            },
            'south-africa': {
                title: 'New Investment Scam Targeting South African Retirees',
                content: 'Scammers are posing as financial advisors offering high-return investment opportunities. Several retirees have reported significant losses. Always verify advisor credentials with the FSCA.',
                time: '5 hours ago',
                severity: 'critical'
            },
            'europe': {
                title: 'EU-Wide SMS Phishing Attack',
                content: 'A new SMS phishing campaign is circulating across Europe, claiming to be from postal services with fake delivery notifications. Do not click on links in unexpected messages.',
                time: '1 day ago',
                severity: 'warning'
            },
            'north-america': {
                title: 'Tax Season Scam Alert for US and Canada',
                content: 'Scammers are impersonating tax authorities demanding immediate payment for alleged tax debts. Remember that legitimate agencies will never demand immediate payment via gift cards or cryptocurrency.',
                time: '3 hours ago',
                severity: 'warning'
            },
            'asia': {
                title: 'Fake Cryptocurrency Exchange Websites in Asia',
                content: 'Multiple fake cryptocurrency exchange websites have been identified targeting investors in Southeast Asia. Always verify website URLs and enable two-factor authentication.',
                time: '6 hours ago',
                severity: 'critical'
            }
        };
        
        const alert = alerts[currentRegion] || alerts.global;
        
        if (alert) {
            featuredAlert.style.display = 'block';
            featuredAlert.querySelector('.alert-card').className = `alert-card ${alert.severity}`;
            featuredAlert.querySelector('.alert-header h2').innerHTML = 
                `<i class="fas fa-exclamation-triangle"></i> ${alert.title}`;
            featuredAlert.querySelector('.alert-time').textContent = alert.time;
            featuredAlert.querySelector('.alert-content').textContent = alert.content;
        } else {
            featuredAlert.style.display = 'none';
        }
    }
    
    function scanAlertLinks() {
        showScanResult('Scanning links in the alert...', 'info');
        
        // Simulate scanning process
        setTimeout(() => {
            const results = ['safe', 'warning', 'danger'];
            const randomResult = results[Math.floor(Math.random() * results.length)];
            
            let message = '';
            switch(randomResult) {
                case 'safe':
                    message = 'No malicious links detected in this alert.';
                    break;
                case 'warning':
                    message = 'One or more links in this alert may be suspicious. Exercise caution.';
                    break;
                case 'danger':
                    message = 'Malicious links detected! Do not click any links in this alert.';
                    break;
            }
            
            showScanResult(message, randomResult);
        }, 2000);
    }
    
    function scanUrl(url) {
        showScanResult('Scanning URL...', 'info');
        
        // Simulate URL scanning process
        setTimeout(() => {
            // Simple heuristic check (in a real app, this would call an API)
            const suspiciousPatterns = [
                'bit.ly', 'tinyurl.com', 'phishing', 'login', 'bank', 'secure',
                'account', 'verify', 'update', 'password', 'credential'
            ];
            
            let riskLevel = 'safe';
            let message = 'This URL appears to be safe.';
            
            // Check for suspicious patterns
            const lowerUrl = url.toLowerCase();
            let suspiciousCount = 0;
            
            suspiciousPatterns.forEach(pattern => {
                if (lowerUrl.includes(pattern)) {
                    suspiciousCount++;
                }
            });
            
            if (suspiciousCount > 3) {
                riskLevel = 'danger';
                message = 'High risk! This URL exhibits multiple characteristics of phishing sites.';
            } else if (suspiciousCount > 1) {
                riskLevel = 'warning';
                message = 'Caution advised. This URL shows some suspicious characteristics.';
            }
            
            // Additional check for known malicious domains (simulated)
            const maliciousDomains = ['evil.com', 'phishy.site', 'scam.example'];
            if (maliciousDomains.some(domain => lowerUrl.includes(domain))) {
                riskLevel = 'danger';
                message = 'DANGER! This domain is known for malicious activity.';
            }
            
            showScanResult(message, riskLevel);
        }, 1500);
    }
    
    function showScanResult(message, type) {
        scanResult.textContent = message;
        scanResult.className = `scan-result ${type}`;
    }
    
    function loadNewsArticles() {
        // Show loading state
        loadingState.style.display = 'flex';
        newsGrid.innerHTML = '';
        
        // Simulate API call delay
        setTimeout(() => {
            // Generate mock news articles
            articles = generateMockArticles(24);
            filteredArticles = [...articles];
            
            // Hide loading state
            loadingState.style.display = 'none';
            
            // Display articles
            displayArticles();
        }, 1000);
    }
    
    function generateMockArticles(count) {
        const categories = ['finance', 'security', 'scam-alerts', 'sustainability'];
        const sources = ['Financial Times', 'Reuters', 'Bloomberg', 'TechCrunch', 'CyberNews', 'ESG Today'];
        const regions = ['Global', 'South Africa', 'Europe', 'North America', 'Asia'];
        
        const articles = [];
        
        for (let i = 0; i < count; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const source = sources[Math.floor(Math.random() * sources.length)];
            const region = regions[Math.floor(Math.random() * regions.length)];
            const hoursAgo = Math.floor(Math.random() * 48);
            
            // Generate title and content based on category
            let title, content;
            
            switch(category) {
                case 'finance':
                    title = financeTitles[Math.floor(Math.random() * financeTitles.length)];
                    content = "Financial markets showed mixed results today as investors weighed new economic data. Analysts suggest a cautious approach amid ongoing volatility.";
                    break;
                case 'security':
                    title = securityTitles[Math.floor(Math.random() * securityTitles.length)];
                    content = "Security experts are warning about a new vulnerability affecting widely used software. Users are advised to update their systems immediately.";
                    break;
                case 'scam-alerts':
                    title = scamTitles[Math.floor(Math.random() * scamTitles.length)];
                    content = "Authorities have issued a warning about a new scam targeting vulnerable populations. Always verify information through official channels.";
                    break;
                case 'sustainability':
                    title = sustainabilityTitles[Math.floor(Math.random() * sustainabilityTitles.length)];
                    content = "New research highlights the growing importance of sustainable investing. Companies with strong ESG practices are outperforming their peers.";
                    break;
            }
            
            articles.push({
                id: i + 1,
                title: title,
                content: content,
                category: category,
                source: source,
                region: region,
                time: `${hoursAgo} hours ago`,
                hasScanAction: category === 'scam-alerts' || Math.random() > 0.7
            });
        }
        
        return articles;
    }
    
    // Sample article titles by category
    const financeTitles = [
        "Central Banks Announce New Monetary Policy Measures",
        "Stock Markets React to Latest Economic Indicators",
        "Cryptocurrency Regulations: What Investors Need to Know",
        "Interest Rate Changes Impact Mortgage Markets",
        "Emerging Markets Show Strong Growth Potential",
        "Sustainable Investing Gains Traction Among Millennials"
    ];
    
    const securityTitles = [
        "New Zero-Day Vulnerability Affects Popular Browsers",
        "Multi-Factor Authentication Becomes Standard Practice",
        "Ransomware Attacks Target Healthcare Institutions",
        "AI-Powered Security Systems Show Promise in Threat Detection",
        "Data Privacy Regulations Tighten Globally",
        "Phishing Attacks Increase by 45% in Q3"
    ];
    
    const scamTitles = [
        "Fake Investment Schemes Target Retirement Savings",
        "Impersonation Scams Rise During Tax Season",
        "New Social Engineering Tactics Exploit Current Events",
        "Fake Tech Support Calls Continue to Victimize Users",
        "Cryptocurrency Scams Promise Unrealistic Returns",
        "Romance Scams Exploit Isolation During Pandemic"
    ];
    
    const sustainabilityTitles = [
        "Green Bonds See Record Growth in 2023",
        "Corporate Sustainability Reporting Becomes Mandatory",
        "Renewable Energy Investments Outperform Fossil Fuels",
        "Climate Risk Assessment Now Part of Financial Due Diligence",
        "Sustainable Agriculture Attracts Impact Investors",
        "ESG Funds Demonstrate Resilience During Market Volatility"
    ];
    
    function filterArticles() {
        filteredArticles = articles.filter(article => {
            // Category filter
            if (currentCategory !== 'all' && article.category !== currentCategory) {
                return false;
            }
            
            // Region filter
            if (currentRegion !== 'global') {
                const regionMap = {
                    'south-africa': 'South Africa',
                    'europe': 'Europe',
                    'north-america': 'North America',
                    'asia': 'Asia'
                };
                
                if (regionMap[currentRegion] && article.region !== regionMap[currentRegion]) {
                    return false;
                }
            }
            
            // Search term filter
            if (currentSearchTerm) {
                const searchLower = currentSearchTerm.toLowerCase();
                return (
                    article.title.toLowerCase().includes(searchLower) ||
                    article.content.toLowerCase().includes(searchLower) ||
                    article.source.toLowerCase().includes(searchLower)
                );
            }
            
            return true;
        });
        
        currentPage = 1;
        displayArticles();
    }
    
    function displayArticles() {
        // Calculate articles to show
        const startIndex = 0;
        const endIndex = currentPage * articlesPerPage;
        const articlesToShow = filteredArticles.slice(startIndex, endIndex);
        
        // Clear grid if it's the first page
        if (currentPage === 1) {
            newsGrid.innerHTML = '';
        }
        
        // Display articles
        articlesToShow.forEach(article => {
            const articleElement = createArticleElement(article);
            newsGrid.appendChild(articleElement);
        });
        
        // Show/hide load more button
        if (endIndex >= filteredArticles.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
        
        // If no articles found, show message
        if (filteredArticles.length === 0) {
            newsGrid.innerHTML = `
                <section class="no-results">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </section>
            `;
            loadMoreBtn.style.display = 'none';
        }
    }
    
    function createArticleElement(article) {
        const articleElement = document.createElement('article');
        articleElement.className = 'news-article';
        
        // Determine category display name and icon
        let categoryDisplay, categoryIcon;
        switch(article.category) {
            case 'finance':
                categoryDisplay = 'Finance';
                categoryIcon = 'fas fa-chart-line';
                break;
            case 'security':
                categoryDisplay = 'Security';
                categoryIcon = 'fas fa-shield-alt';
                break;
            case 'scam-alerts':
                categoryDisplay = 'Scam Alert';
                categoryIcon = 'fas fa-exclamation-triangle';
                break;
            case 'sustainability':
                categoryDisplay = 'Sustainability';
                categoryIcon = 'fas fa-leaf';
                break;
        }
        
        articleElement.innerHTML = `
            <header class="article-header">
                <span class="article-category ${article.category}">
                    <i class="${categoryIcon}"></i> ${categoryDisplay}
                </span>
                <time class="article-time">${article.time}</time>
            </header>
            <section class="article-content">
                <h3>${article.title}</h3>
                <p>${article.content}</p>
            </section>
            <footer class="article-meta">
                <span class="article-source">Source: ${article.source} • ${article.region}</span>
                <menu class="article-actions">
                    <button class="btn btn-outline btn-sm read-more" data-article="${article.id}">
                        <i class="fas fa-book-open"></i> Read More
                    </button>
                    ${article.hasScanAction ? `
                    <button class="btn btn-primary btn-sm scan-article" data-article="${article.id}">
                        <i class="fas fa-shield-alt"></i> Scan Links
                    </button>
                    ` : ''}
                </menu>
            </footer>
        `;
        
        // Add event listeners
        const readMoreBtn = articleElement.querySelector('.read-more');
        const scanBtn = articleElement.querySelector('.scan-article');
        
        readMoreBtn.addEventListener('click', function() {
            openArticleModal(article);
        });
        
        if (scanBtn) {
            scanBtn.addEventListener('click', function() {
                scanArticleLinks(article);
            });
        }
        
        return articleElement;
    }
    
    function openArticleModal(article) {
        // In a real application, this would open a modal with full article content
        alert(`Full article content for: ${article.title}\n\nThis would open in a modal with the complete article text, images, and related links.`);
    }
    
    function scanArticleLinks(article) {
        showScanResult(`Scanning links in: ${article.title}`, 'info');
        
        // Simulate scanning process
        setTimeout(() => {
            // 80% chance the article is safe, 20% chance it has suspicious links
            const isSafe = Math.random() > 0.2;
            
            if (isSafe) {
                showScanResult('No malicious links detected in this article.', 'safe');
            } else {
                showScanResult('Warning: This article contains suspicious links. Exercise caution.', 'warning');
            }
        }, 1500);
    }
    
    function generateAIInsights() {
        // Simulate AI-generated insights based on current news trends
        const insights = [
            {
                icon: 'fas fa-chart-line',
                title: 'Market Sentiment Analysis',
                content: 'AI analysis indicates positive sentiment around sustainable investments, with a 15% increase in related articles this month.',
                change: '+15%',
                changeType: 'positive'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Threat Level Assessment',
                content: 'Cybersecurity threat level elevated due to increased phishing campaigns targeting financial institutions.',
                change: 'Elevated',
                changeType: 'negative'
            },
            {
                icon: 'fas fa-exclamation-triangle',
                title: 'Scam Pattern Detection',
                content: 'New pattern detected: scammers are increasingly using current events to create convincing phishing lures.',
                change: 'New Pattern',
                changeType: 'warning'
            },
            {
                icon: 'fas fa-leaf',
                title: 'ESG Investment Trends',
                content: 'Sustainable funds continue to outperform traditional investments, with 72% showing above-average returns.',
                change: '+72%',
                changeType: 'positive'
            }
        ];
        
        // Clear existing insights
        insightsGrid.innerHTML = '';
        
        // Create insight cards
        insights.forEach(insight => {
            const insightCard = document.createElement('article');
            insightCard.className = 'insight-card';
            
            insightCard.innerHTML = `
                <h3><i class="${insight.icon}"></i> ${insight.title}</h3>
                <p class="insight-content">${insight.content}</p>
                <footer class="insight-stats">
                    <span>Trend</span>
                    <span class="stat-change ${insight.changeType}">${insight.change}</span>
                </footer>
            `;
            
            insightsGrid.appendChild(insightCard);
        });
    }
});