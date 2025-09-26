document.addEventListener('DOMContentLoaded', () => {
    const stockGrid = document.getElementById('stock-grid');
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];

    const fetchStockData = async (symbol) => {
        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
            const data = response.data['Global Quote'];
            return {
                symbol: data['01. symbol'],
                price: parseFloat(data['05. price']).toFixed(2),
                change: parseFloat(data['09. change']).toFixed(2),
                changePercent: parseFloat(data['10. change percent'].replace('%', '')).toFixed(2),
            };
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            return null;
        }
    };

    const renderStockCards = async () => {
        for (const symbol of stocks) {
            const stockData = await fetchStockData(symbol);
            if (stockData) {
                const changeClass = stockData.change >= 0 ? 'positive' : 'negative';
                const stockCard = `
                    <article class="stock-card">
                        <h3>${stockData.symbol}</h3>
                        <p class="price">R${stockData.price}</p>
                        <p class="change ${changeClass}">${stockData.change} (${stockData.changePercent}%)</p>
                    </article>
                `;
                stockGrid.innerHTML += stockCard;
            }
        }
    };

    renderStockCards();
});
