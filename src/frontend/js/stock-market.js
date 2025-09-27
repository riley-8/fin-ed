// stock-market.js - Stock Market page functionality

// Stock Market Simulator Class
class StockMarketSimulator {
    constructor() {
        this.virtualBalance = 10000;
        this.portfolio = {};
        this.transactions = [];
        this.stocks = this.generateStocks();
        this.marketNews = this.generateNews();
        this.marketAlerts = [];
        this.currentDay = 0;
        this.isPaused = false;
        this.timeScale = 1;
        this.riskTolerance = 3;
        this.portfolioChart = null;
        this.selectedStock = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderStocks();
        this.renderNews();
        this.updatePortfolioDisplay();
        this.initCharts();
        this.startMarketSimulation();
        this.updateRiskRecommendation();
    }
    
    // Generate sample stock data
    generateStocks() {
        return [
            { symbol: 'TECH', name: 'Tech Innovations Inc', price: 150.25, change: 2.5, sector: 'tech', esgScore: 75, volatility: 0.8 },
            { symbol: 'FIN', name: 'Global Finance Corp', price: 85.60, change: -0.8, sector: 'finance', esgScore: 65, volatility: 0.6 },
            { symbol: 'HEAL', name: 'Health Solutions Ltd', price: 120.75, change: 1.2, sector: 'healthcare', esgScore: 80, volatility: 0.5 },
            { symbol: 'ENER', name: 'Clean Energy Co', price: 45.30, change: 3.1, sector: 'energy', esgScore: 90, volatility: 0.7 },
            { symbol: 'SUS', name: 'Sustainable Growth', price: 65.80, change: 0.5, sector: 'sustainable', esgScore: 95, volatility: 0.4 },
            { symbol: 'AI', name: 'AI Analytics Group', price: 210.40, change: -1.5, sector: 'tech', esgScore: 70, volatility: 0.9 },
            { symbol: 'BANK', name: 'Secure Bank Ltd', price: 75.20, change: 0.3, sector: 'finance', esgScore: 60, volatility: 0.5 },
            { symbol: 'MED', name: 'Medical Research Co', price: 135.90, change: 2.1, sector: 'healthcare', esgScore: 85, volatility: 0.6 }
        ];
    }
    
    // Generate sample market news
    generateNews() {
        return [
            { title: 'Tech Sector Shows Strong Growth', date: '2 hours ago', impact: 'positive', sectors: ['tech'] },
            { title: 'Regulatory Changes Affect Finance Industry', date: '4 hours ago', impact: 'negative', sectors: ['finance'] },
            { title: 'Breakthrough in Medical Research', date: '6 hours ago', impact: 'positive', sectors: ['healthcare'] },
            { title: 'Sustainable Companies Outperform Market', date: '1 day ago', impact: 'positive', sectors: ['sustainable'] },
            { title: 'Energy Prices Volatile Amid Global Events', date: '1 day ago', impact: 'mixed', sectors: ['energy'] }
        ];
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Navigation toggle
        document.getElementById('navToggle').addEventListener('click', this.toggleNavigation);
        
        // Market controls
        document.getElementById('timeScale').addEventListener('change', (e) => {
            this.timeScale = parseInt(e.target.value);
        });
        
        document.getElementById('pauseSimulation').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('advanceDay').addEventListener('click', () => {
            this.advanceDay();
        });
        
        // Risk tolerance slider
        document.getElementById('riskTolerance').addEventListener('input', (e) => {
            this.riskTolerance = parseInt(e.target.value);
            document.getElementById('riskValue').textContent = this.getRiskLabel(this.riskTolerance);
            this.updateRiskRecommendation();
        });
        
        // Stock filters
        document.getElementById('stockSearch').addEventListener('input', (e) => {
            this.filterStocks(e.target.value, document.getElementById('sectorFilter').value);
        });
        
        document.getElementById('sectorFilter').addEventListener('change', (e) => {
            this.filterStocks(document.getElementById('stockSearch').value, e.target.value);
        });
        
        // ESG stocks button
        document.getElementById('showEsgStocks').addEventListener('click', () => {
            this.showEsgStocks();
        });
        
        // Trade form
        document.getElementById('tradeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.executeTrade();
        });
        
        document.getElementById('selectedStock').addEventListener('change', (e) => {
            this.updateTradePreview();
        });
        
        document.getElementById('tradeAction').addEventListener('change', (e) => {
            this.updateTradePreview();
        });
        
        document.getElementById('tradeQuantity').addEventListener('input', (e) => {
            this.updateTradePreview();
        });
        
        // Reset portfolio
        document.getElementById('resetPortfolio').addEventListener('click', () => {
            this.resetPortfolio();
        });
    }
    
    // Toggle mobile navigation
    toggleNavigation() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }
    
    // Render stocks list
    renderStocks(filteredStocks = null) {
        const stocksList = document.getElementById('stocksList');
        const stocks = filteredStocks || this.stocks;
        
        stocksList.innerHTML = '';
        
        stocks.forEach(stock => {
            const stockCard = document.createElement('article');
            stockCard.className = 'stock-card';
            stockCard.innerHTML = `
                <section class="stock-symbol">${stock.symbol}</section>
                <section class="stock-name">${stock.name}</section>
                <section class="stock-price">$${stock.price.toFixed(2)}</section>
                <section class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                    ${stock.change >= 0 ? '↗' : '↘'} ${Math.abs(stock.change).toFixed(2)}%
                </section>
                <section class="stock-actions">
                    <button class="btn btn-outline btn-sm view-stock" data-symbol="${stock.symbol}">View</button>
                    <button class="btn btn-primary btn-sm trade-stock" data-symbol="${stock.symbol}">Trade</button>
                </section>
            `;
            
            stocksList.appendChild(stockCard);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.view-stock').forEach(button => {
            button.addEventListener('click', (e) => {
                const symbol = e.target.getAttribute('data-symbol');
                this.showStockDetail(symbol);
            });
        });
        
        document.querySelectorAll('.trade-stock').forEach(button => {
            button.addEventListener('click', (e) => {
                const symbol = e.target.getAttribute('data-symbol');
                this.prepareTrade(symbol);
            });
        });
        
        // Update trade form stock options
        this.updateTradeFormOptions();
    }
    
    // Render market news
    renderNews() {
        const newsList = document.getElementById('newsList');
        newsList.innerHTML = '';
        
        this.marketNews.forEach(news => {
            const newsItem = document.createElement('li');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <h3>${news.title}</h3>
                <time>${news.date}</time>
            `;
            newsList.appendChild(newsItem);
        });
    }
    
    // Filter stocks based on search and sector
    filterStocks(searchTerm, sector) {
        let filteredStocks = this.stocks;
        
        if (searchTerm) {
            filteredStocks = filteredStocks.filter(stock => 
                stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                stock.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (sector) {
            filteredStocks = filteredStocks.filter(stock => stock.sector === sector);
        }
        
        this.renderStocks(filteredStocks);
    }
    
    // Show ESG stocks
    showEsgStocks() {
        const highEsgStocks = this.stocks.filter(stock => stock.esgScore >= 80);
        this.renderStocks(highEsgStocks);
        
        // Show ESG metrics
        this.showEsgMetrics();
    }
    
    // Show ESG metrics
    showEsgMetrics() {
        const esgMetrics = document.getElementById('esgMetrics');
        const avgEsg = this.stocks.reduce((sum, stock) => sum + stock.esgScore, 0) / this.stocks.length;
        const highEsgCount = this.stocks.filter(stock => stock.esgScore >= 80).length;
        
        esgMetrics.innerHTML = `
            <section class="esg-metric">
                <span>Average ESG Score</span>
                <span>${avgEsg.toFixed(1)}</span>
            </section>
            <section class="esg-metric">
                <span>High ESG Stocks</span>
                <span>${highEsgCount} of ${this.stocks.length}</span>
            </section>
            <section class="esg-metric">
                <span>Top ESG Sector</span>
                <span>Sustainable</span>
            </section>
        `;
    }
    
    // Prepare trade for a specific stock
    prepareTrade(symbol) {
        document.getElementById('selectedStock').value = symbol;
        this.updateTradePreview();
        
        // Scroll to trade form
        document.querySelector('.trading-interface').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update trade form options
    updateTradeFormOptions() {
        const select = document.getElementById('selectedStock');
        select.innerHTML = '<option value="">Select a stock</option>';
        
        this.stocks.forEach(stock => {
            const option = document.createElement('option');
            option.value = stock.symbol;
            option.textContent = `${stock.symbol} - ${stock.name}`;
            select.appendChild(option);
        });
    }
    
    // Update trade preview
    updateTradePreview() {
        const symbol = document.getElementById('selectedStock').value;
        const action = document.getElementById('tradeAction').value;
        const quantity = parseInt(document.getElementById('tradeQuantity').value) || 0;
        
        if (!symbol) {
            document.getElementById('estimatedCost').textContent = '$0.00';
            return;
        }
        
        const stock = this.stocks.find(s => s.symbol === symbol);
        const cost = stock.price * quantity;
        
        document.getElementById('estimatedCost').textContent = `$${cost.toFixed(2)}`;
        document.getElementById('availableBalance').textContent = `$${this.virtualBalance.toFixed(2)}`;
    }
    
    // Execute a trade
    executeTrade() {
        const symbol = document.getElementById('selectedStock').value;
        const action = document.getElementById('tradeAction').value;
        const quantity = parseInt(document.getElementById('tradeQuantity').value);
        
        if (!symbol || quantity <= 0) {
            this.showAlert('Please select a stock and enter a valid quantity.', 'error');
            return;
        }
        
        const stock = this.stocks.find(s => s.symbol === symbol);
        const cost = stock.price * quantity;
        
        if (action === 'buy') {
            if (cost > this.virtualBalance) {
                this.showAlert('Insufficient funds to complete this trade.', 'error');
                return;
            }
            
            this.virtualBalance -= cost;
            
            if (this.portfolio[symbol]) {
                this.portfolio[symbol].quantity += quantity;
                this.portfolio[symbol].totalCost += cost;
            } else {
                this.portfolio[symbol] = {
                    quantity: quantity,
                    totalCost: cost,
                    symbol: symbol,
                    name: stock.name
                };
            }
            
            this.showAlert(`Successfully bought ${quantity} shares of ${symbol} for $${cost.toFixed(2)}.`, 'success');
        } else { // sell
            if (!this.portfolio[symbol] || this.portfolio[symbol].quantity < quantity) {
                this.showAlert(`You don't have enough shares of ${symbol} to sell.`, 'error');
                return;
            }
            
            this.virtualBalance += cost;
            this.portfolio[symbol].quantity -= quantity;
            
            if (this.portfolio[symbol].quantity === 0) {
                delete this.portfolio[symbol];
            }
            
            this.showAlert(`Successfully sold ${quantity} shares of ${symbol} for $${cost.toFixed(2)}.`, 'success');
        }
        
        // Record transaction
        this.recordTransaction(symbol, action, quantity, stock.price, cost);
        
        // Update displays
        this.updatePortfolioDisplay();
        this.updateTradePreview();
        document.getElementById('tradeForm').reset();
    }
    
    // Record a transaction
    recordTransaction(symbol, action, quantity, price, total) {
        const transaction = {
            date: new Date().toLocaleDateString(),
            symbol: symbol,
            action: action,
            quantity: quantity,
            price: price,
            total: total
        };
        
        this.transactions.unshift(transaction);
        this.renderTransactions();
    }
    
    // Render transactions
    renderTransactions() {
        const transactionsBody = document.getElementById('transactionsBody');
        transactionsBody.innerHTML = '';
        
        this.transactions.slice(0, 10).forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.symbol}</td>
                <td class="transaction-${transaction.action}">${transaction.action.toUpperCase()}</td>
                <td>${transaction.quantity}</td>
                <td>$${transaction.price.toFixed(2)}</td>
                <td>$${transaction.total.toFixed(2)}</td>
            `;
            transactionsBody.appendChild(row);
        });
    }
    
    // Update portfolio display
    updatePortfolioDisplay() {
        document.getElementById('virtualBalance').textContent = `$${this.virtualBalance.toFixed(2)}`;
        
        let portfolioValue = this.virtualBalance;
        Object.values(this.portfolio).forEach(holding => {
            const stock = this.stocks.find(s => s.symbol === holding.symbol);
            portfolioValue += stock.price * holding.quantity;
        });
        
        document.getElementById('portfolioValue').textContent = `$${portfolioValue.toFixed(2)}`;
        
        const totalReturn = portfolioValue - 10000;
        const returnPercentage = (totalReturn / 10000) * 100;
        document.getElementById('totalReturn').textContent = 
            `$${totalReturn.toFixed(2)} (${returnPercentage.toFixed(2)}%)`;
        
        // Update chart
        this.updatePortfolioChart();
    }
    
    // Initialize charts
    initCharts() {
        const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
        
        this.portfolioChart = new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: ['Day 0'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [10000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Update portfolio chart
    updatePortfolioChart() {
        if (!this.portfolioChart) return;
        
        let portfolioValue = this.virtualBalance;
        Object.values(this.portfolio).forEach(holding => {
            const stock = this.stocks.find(s => s.symbol === holding.symbol);
            portfolioValue += stock.price * holding.quantity;
        });
        
        // Add new data point
        this.portfolioChart.data.labels.push(`Day ${this.currentDay}`);
        this.portfolioChart.data.datasets[0].data.push(portfolioValue);
        
        // Keep only last 20 data points
        if (this.portfolioChart.data.labels.length > 20) {
            this.portfolioChart.data.labels.shift();
            this.portfolioChart.data.datasets[0].data.shift();
        }
        
        this.portfolioChart.update();
    }
    
    // Start market simulation
    startMarketSimulation() {
        setInterval(() => {
            if (!this.isPaused) {
                this.simulateMarketChanges();
            }
        }, 3000 / this.timeScale); // Adjust interval based on time scale
    }
    
    // Simulate market changes
    simulateMarketChanges() {
        this.stocks.forEach(stock => {
            // Base change based on volatility
            let change = (Math.random() - 0.5) * stock.volatility * 2;
            
            // Add some trend based on news impact
            const relevantNews = this.marketNews.filter(news => 
                news.sectors.includes(stock.sector)
            );
            
            if (relevantNews.length > 0) {
                const netImpact = relevantNews.reduce((sum, news) => {
                    return sum + (news.impact === 'positive' ? 0.2 : news.impact === 'negative' ? -0.2 : 0);
                }, 0);
                
                change += netImpact;
            }
            
            // Apply change
            const oldPrice = stock.price;
            stock.price *= (1 + change / 100);
            stock.change = change;
            
            // Highlight price changes in UI
            this.highlightPriceChange(stock.symbol, oldPrice, stock.price);
        });
        
        this.currentDay++;
        this.renderStocks();
        this.updatePortfolioDisplay();
        this.generateMarketAlerts();
    }
    
    // Highlight price changes in UI
    highlightPriceChange(symbol, oldPrice, newPrice) {
        const stockElement = document.querySelector(`.stock-card:has(.stock-symbol:contains("${symbol}"))`);
        if (!stockElement) return;
        
        const priceElement = stockElement.querySelector('.stock-price');
        const changeElement = stockElement.querySelector('.stock-change');
        
        if (newPrice > oldPrice) {
            priceElement.classList.add('price-rise');
            changeElement.classList.remove('negative');
            changeElement.classList.add('positive');
            changeElement.innerHTML = `↗ ${((newPrice - oldPrice) / oldPrice * 100).toFixed(2)}%`;
        } else if (newPrice < oldPrice) {
            priceElement.classList.add('price-fall');
            changeElement.classList.remove('positive');
            changeElement.classList.add('negative');
            changeElement.innerHTML = `↘ ${((oldPrice - newPrice) / oldPrice * 100).toFixed(2)}%`;
        }
        
        priceElement.textContent = `$${newPrice.toFixed(2)}`;
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            priceElement.classList.remove('price-rise', 'price-fall');
        }, 1000);
    }
    
    // Generate market alerts
    generateMarketAlerts() {
        // Clear old alerts
        this.marketAlerts = [];
        
        // Check for significant price movements
        this.stocks.forEach(stock => {
            if (Math.abs(stock.change) > 5) {
                this.marketAlerts.push({
                    type: 'warning',
                    title: `${stock.symbol} Price ${stock.change > 0 ? 'Surge' : 'Drop'}`,
                    message: `${stock.symbol} has ${stock.change > 0 ? 'increased' : 'decreased'} by ${Math.abs(stock.change).toFixed(2)}% in the last period.`,
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        });
        
        // Check portfolio for significant changes
        let portfolioValue = this.virtualBalance;
        Object.values(this.portfolio).forEach(holding => {
            const stock = this.stocks.find(s => s.symbol === holding.symbol);
            portfolioValue += stock.price * holding.quantity;
        });
        
        const dailyReturn = portfolioValue - 10000;
        if (Math.abs(dailyReturn) > 500) {
            this.marketAlerts.push({
                type: dailyReturn > 0 ? 'info' : 'warning',
                title: `Portfolio ${dailyReturn > 0 ? 'Gain' : 'Loss'}`,
                message: `Your portfolio has ${dailyReturn > 0 ? 'gained' : 'lost'} $${Math.abs(dailyReturn).toFixed(2)} today.`,
                timestamp: new Date().toLocaleTimeString()
            });
        }
        
        this.renderAlerts();
    }
    
    // Render market alerts
    renderAlerts() {
        const alertsList = document.getElementById('alertsList');
        alertsList.innerHTML = '';
        
        this.marketAlerts.forEach(alert => {
            const alertItem = document.createElement('li');
            alertItem.className = 'alert-item';
            alertItem.innerHTML = `
                <section class="alert-icon ${alert.type}">!</section>
                <section class="alert-content">
                    <h3>${alert.title}</h3>
                    <p>${alert.message}</p>
                    <time>${alert.timestamp}</time>
                </section>
            `;
            alertsList.appendChild(alertItem);
        });
    }
    
    // Toggle simulation pause
    togglePause() {
        this.isPaused = !this.isPaused;
        const button = document.getElementById('pauseSimulation');
        button.textContent = this.isPaused ? 'Resume' : 'Pause';
        button.classList.toggle('btn-secondary');
        button.classList.toggle('btn-primary');
    }
    
    // Advance simulation by one day
    advanceDay() {
        this.simulateMarketChanges();
    }
    
    // Update risk recommendation
    updateRiskRecommendation() {
        const recommendation = document.getElementById('aiRecommendation');
        
        let stockPercentage, bondPercentage, cashPercentage;
        
        switch(this.riskTolerance) {
            case 1: // Conservative
                stockPercentage = 30;
                bondPercentage = 50;
                cashPercentage = 20;
                break;
            case 2: // Moderately Conservative
                stockPercentage = 40;
                bondPercentage = 40;
                cashPercentage = 20;
                break;
            case 3: // Balanced
                stockPercentage = 60;
                bondPercentage = 30;
                cashPercentage = 10;
                break;
            case 4: // Moderately Aggressive
                stockPercentage = 70;
                bondPercentage = 20;
                cashPercentage = 10;
                break;
            case 5: // Aggressive
                stockPercentage = 85;
                bondPercentage = 10;
                cashPercentage = 5;
                break;
        }
        
        recommendation.textContent = `Based on your ${this.getRiskLabel(this.riskTolerance).toLowerCase()} risk profile, our AI recommends a portfolio with ${stockPercentage}% stocks, ${bondPercentage}% bonds, and ${cashPercentage}% cash.`;
    }
    
    // Get risk label
    getRiskLabel(riskLevel) {
        switch(riskLevel) {
            case 1: return 'Conservative';
            case 2: return 'Moderately Conservative';
            case 3: return 'Balanced';
            case 4: return 'Moderately Aggressive';
            case 5: return 'Aggressive';
            default: return 'Balanced';
        }
    }
    
    // Show stock detail modal
    showStockDetail(symbol) {
        const stock = this.stocks.find(s => s.symbol === symbol);
        if (!stock) return;
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('stockDetailModal');
        if (!modal) {
            modal = document.createElement('section');
            modal.id = 'stockDetailModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <section class="modal-content">
                    <header class="modal-header">
                        <h2>Stock Details</h2>
                        <button class="modal-close">&times;</button>
                    </header>
                    <section class="modal-body" id="stockDetailContent">
                        <!-- Content will be populated here -->
                    </section>
                </section>
            `;
            document.body.appendChild(modal);
            
            // Add close event
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Populate modal content
        const content = modal.querySelector('#stockDetailContent');
        content.innerHTML = `
            <section class="stock-header">
                <h3>${stock.symbol} - ${stock.name}</h3>
                <p class="stock-price-large">$${stock.price.toFixed(2)}</p>
                <p class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                    ${stock.change >= 0 ? '↗' : '↘'} ${Math.abs(stock.change).toFixed(2)}%
                </p>
            </section>
            
            <section class="stock-detail-chart">
                <canvas id="stockDetailChart"></canvas>
            </section>
            
            <section class="stock-detail-metrics">
                <section class="stock-detail-metric">
                    <h3>Sector</h3>
                    <p class="value">${this.formatSector(stock.sector)}</p>
                </section>
                <section class="stock-detail-metric">
                    <h3>ESG Score</h3>
                    <p class="value">${stock.esgScore}/100</p>
                </section>
                <section class="stock-detail-metric">
                    <h3>Volatility</h3>
                    <p class="value">${(stock.volatility * 100).toFixed(0)}%</p>
                </section>
                <section class="stock-detail-metric">
                    <h3>Your Holdings</h3>
                    <p class="value">${this.portfolio[stock.symbol] ? this.portfolio[stock.symbol].quantity : 0} shares</p>
                </section>
            </section>
            
            <section class="stock-analysis">
                <h3>AI Analysis</h3>
                <p>${this.generateStockAnalysis(stock)}</p>
            </section>
            
            <section class="modal-actions">
                <button class="btn btn-primary" id="tradeFromModal" data-symbol="${stock.symbol}">Trade This Stock</button>
            </section>
        `;
        
        // Initialize chart
        this.initStockDetailChart(stock);
        
        // Add trade event
        content.querySelector('#tradeFromModal').addEventListener('click', () => {
            this.prepareTrade(stock.symbol);
            modal.style.display = 'none';
        });
        
        // Show modal
        modal.style.display = 'flex';
    }
    
    // Initialize stock detail chart
    initStockDetailChart(stock) {
        const ctx = document.getElementById('stockDetailChart').getContext('2d');
        
        // Generate mock historical data
        const historicalData = [];
        let currentPrice = stock.price;
        
        for (let i = 30; i >= 0; i--) {
            historicalData.unshift(currentPrice);
            // Simulate price movement
            currentPrice *= (1 + (Math.random() - 0.5) * stock.volatility / 10);
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 31}, (_, i) => `${i} days ago`).reverse(),
                datasets: [{
                    label: 'Price History',
                    data: historicalData,
                    borderColor: stock.change >= 0 ? '#10b981' : '#ef4444',
                    backgroundColor: stock.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Format sector name
    formatSector(sector) {
        const sectorMap = {
            'tech': 'Technology',
            'finance': 'Finance',
            'healthcare': 'Healthcare',
            'energy': 'Energy',
            'sustainable': 'Sustainable'
        };
        
        return sectorMap[sector] || sector;
    }
    
    // Generate stock analysis
    generateStockAnalysis(stock) {
        let analysis = '';
        
        if (stock.esgScore >= 80) {
            analysis += 'This stock has a strong ESG profile, making it suitable for sustainable investors. ';
        }
        
        if (stock.volatility > 0.7) {
            analysis += 'It exhibits higher volatility, which may present both opportunities and risks. ';
        } else {
            analysis += 'It shows relatively stable price movements, suitable for conservative investors. ';
        }
        
        if (stock.change > 2) {
            analysis += 'Recent performance has been strong with significant upward momentum. ';
        } else if (stock.change < -2) {
            analysis += 'Recent performance has been challenging with downward pressure. ';
        } else {
            analysis += 'Recent performance has been relatively stable. ';
        }
        
        analysis += 'Consider your risk tolerance and investment goals when evaluating this stock.';
        
        return analysis;
    }
    
    // Reset portfolio
    resetPortfolio() {
        if (confirm('Are you sure you want to reset your portfolio? This will clear all your holdings and transactions.')) {
            this.virtualBalance = 10000;
            this.portfolio = {};
            this.transactions = [];
            this.currentDay = 0;
            
            this.updatePortfolioDisplay();
            this.renderTransactions();
            this.showAlert('Portfolio has been reset successfully.', 'success');
        }
    }
    
    // Show alert message
    showAlert(message, type) {
        // Create alert element
        const alert = document.createElement('section');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <p>${message}</p>
            <button class="alert-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(alert);
        
        // Add close event
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StockMarketSimulator();
});

// Add CSS for alerts
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    .alert {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    }
    
    .alert-success {
        background: var(--success-color);
        color: white;
    }
    
    .alert-error {
        background: var(--danger-color);
        color: white;
    }
    
    .alert-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(alertStyles);