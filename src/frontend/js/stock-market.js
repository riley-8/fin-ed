
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('stock-search');
    const watchlistGrid = document.getElementById('watchlist-grid');
    let mainChart; // To hold the chart instance

    // --- Mock Data for Stock Watchlist and Market Movers ---
    const mockStockData = {
        'AAPL': { name: 'Apple Inc.', price: 172.50, change: 1.25, changePercent: 0.73, volume: '95M', marketCap: '2.8T', fiftyTwoWeekHigh: 199.62, fiftyTwoWeekLow: 164.08, data: [165, 168, 170, 175, 172, 173, 172.50] },
        'GOOGL': { name: 'Alphabet Inc.', price: 140.76, change: -0.50, changePercent: -0.35, volume: '28M', marketCap: '1.7T', fiftyTwoWeekHigh: 155.20, fiftyTwoWeekLow: 116.33, data: [142, 141, 143, 139, 140, 141.2, 140.76] },
        'MSFT': { name: 'Microsoft Corp.', price: 410.60, change: 2.10, changePercent: 0.51, volume: '25M', marketCap: '3.1T', fiftyTwoWeekHigh: 430.82, fiftyTwoWeekLow: 309.49, data: [400, 405, 408, 412, 409, 408.5, 410.60] },
        'AMZN': { name: 'Amazon.com, Inc.', price: 180.96, change: -1.80, changePercent: -0.98, volume: '45M', marketCap: '1.9T', fiftyTwoWeekHigh: 191.70, fiftyTwoWeekLow: 118.35, data: [185, 183, 182, 184, 181, 182, 180.96] },
        'TSLA': { name: 'Tesla, Inc.', price: 183.01, change: 5.00, changePercent: 2.81, volume: '110M', marketCap: '580B', fiftyTwoWeekHigh: 299.29, fiftyTwoWeekLow: 138.80, data: [175, 178, 180, 182, 179, 181, 183.01] },
        'NVDA': { name: 'NVIDIA Corp.', price: 950.00, change: 15.50, changePercent: 1.66, volume: '60M', marketCap: '2.3T', fiftyTwoWeekHigh: 974.00, fiftyTwoWeekLow: 403.11, data: [920, 930, 945, 960, 940, 948, 950.00] },
    };

    // --- Render Watchlist ---
    const renderWatchlist = (filter = '') => {
        if (!watchlistGrid) return;
        watchlistGrid.innerHTML = '';
        const filteredData = Object.keys(mockStockData).filter(symbol => 
            symbol.toLowerCase().includes(filter) || 
            mockStockData[symbol].name.toLowerCase().includes(filter)
        );

        if (filteredData.length === 0) {
            watchlistGrid.innerHTML = '<p class="no-results">No stocks found.</p>';
            return;
        }

        filteredData.forEach(symbol => {
            const stock = mockStockData[symbol];
            const changeClass = stock.change >= 0 ? 'text-emerald-500' : 'text-red-500';
            const icon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';

            const card = document.createElement('div');
            card.className = 'watchlist-item';
            card.dataset.symbol = symbol;
            card.innerHTML = `
                <div class="item-info">
                    <h4 class="item-symbol">${symbol}</h4>
                    <p class="item-name">${stock.name}</p>
                </div>
                <div class="item-price-container">
                    <p class="item-price">R${stock.price.toFixed(2)}</p>
                    <p class="item-change ${changeClass}">
                        <i class="fas ${icon}"></i> ${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)
                    </p>
                </div>
            `;
            watchlistGrid.appendChild(card);
        });

        // Add click listeners to newly rendered items
        addWatchlistClickListeners();
    };

    // --- Update Main Chart and Details ---
    const updateMainDisplay = (symbol) => {
        const stock = mockStockData[symbol];
        if (!stock) return;

        // Update details
        document.getElementById('main-stock-symbol').textContent = symbol;
        document.getElementById('main-stock-name').textContent = stock.name;
        document.getElementById('main-stock-price').textContent = `R${stock.price.toFixed(2)}`;
        const mainChangeEl = document.getElementById('main-stock-change');
        mainChangeEl.textContent = `${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)`;
        mainChangeEl.className = stock.change >= 0 ? 'price-change positive' : 'price-change negative';
        
        // Update stats
        document.getElementById('stat-market-cap').textContent = stock.marketCap;
        document.getElementById('stat-volume').textContent = stock.volume;
        document.getElementById('stat-high').textContent = `R${stock.fiftyTwoWeekHigh.toFixed(2)}`;
        document.getElementById('stat-low').textContent = `R${stock.fiftyTwoWeekLow.toFixed(2)}`;

        // Update active item in watchlist
        document.querySelectorAll('.watchlist-item').forEach(item => {
            item.classList.toggle('active', item.dataset.symbol === symbol);
        });

        // Update chart
        updateChart(stock);
    };

    // --- Chart.js Logic ---
    const updateChart = (stock) => {
        const ctx = document.getElementById('stock-performance-chart').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, stock.change >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(30, 41, 59, 0)');

        const chartData = {
            labels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'],
            datasets: [{
                label: stock.name,
                data: stock.data,
                fill: true,
                backgroundColor: gradient,
                borderColor: stock.change >= 0 ? '#10b981' : '#ef4444',
                tension: 0.4,
                pointBackgroundColor: 'transparent',
                pointBorderColor: 'transparent',
            }]
        };

        if (mainChart) {
            mainChart.data = chartData;
            mainChart.update();
        } else {
            mainChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { x: { grid: { display: false } }, y: { grid: { color: '#334155' } } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    };

    // --- Event Listeners ---
    const addWatchlistClickListeners = () => {
        document.querySelectorAll('.watchlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.dataset.symbol;
                updateMainDisplay(symbol);
            });
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderWatchlist(e.target.value.toLowerCase());
        });
    }

    // --- Initial Load ---
    renderWatchlist();
    updateMainDisplay('AAPL'); // Load default stock
});
