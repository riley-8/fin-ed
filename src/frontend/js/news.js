document.addEventListener('DOMContentLoaded', () => {
    const articlesGrid = document.getElementById('articles-grid');
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const newsSource = 'business-insider';

    const fetchNews = async () => {
        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?sources=${newsSource}&apiKey=${apiKey}`);
            const articles = response.data.articles;
            renderArticles(articles);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const renderArticles = (articles) => {
        articlesGrid.innerHTML = '';
        articles.forEach(article => {
            const articleCard = `
                <article class="article-card">
                    <img src="${article.urlToImage}" alt="Article Image">
                    <div class="article-card-content">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank" class="read-more">Read More</a>
                    </div>
                </article>
            `;
            articlesGrid.innerHTML += articleCard;
        });
    };

    fetchNews();
});
