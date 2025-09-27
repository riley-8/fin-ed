
document.addEventListener('DOMContentLoaded', () => {
    const articlesGrid = document.getElementById('articles-grid');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const searchInput = document.getElementById('news-search');

    // --- Dummy Data for Financial News ---
    const dummyNewsData = [
        {
            title: 'Global Markets Rally on Positive Economic Outlook',
            description: 'Stock markets across the globe saw a significant surge today as new data suggests a stronger-than-expected economic recovery, boosting investor confidence.',
            urlToImage: 'https://placehold.co/600x400/1e293b/ffffff?text=Markets+Rally',
            url: '#',
            category: 'markets',
            publishedAt: '2024-07-29T14:30:00Z'
        },
        {
            title: 'The Rise of ESG Investing: Aligning Portfolios with Values',
            description: 'Environmental, Social, and Governance (ESG) criteria are becoming a major factor for investors. This article explores how to integrate ESG principles into your investment strategy.',
            urlToImage: 'https://placehold.co/600x400/1e293b/ffffff?text=ESG+Investing',
            url: '#',
            category: 'investing',
            publishedAt: '2024-07-29T12:00:00Z'
        },
        {
            title: 'Federal Reserve Holds Interest Rates Steady, Citing Inflation Concerns',
            description: 'The central bank announced its decision to maintain the current interest rate, balancing economic growth with concerns over rising inflation.',
            urlToImage: 'https://placehold.co/600x400/1e293b/ffffff?text=Fed+Rates',
            url: '#',
            category: 'economy',
            publishedAt: '2024-07-28T18:45:00Z'
        },
        {
            title: 'FinTech Disruptors: Top 5 Companies to Watch in 2024',
            description: 'From AI-driven financial planning to blockchain-based payment systems, these five FinTech startups are revolutionizing the financial industry.',
            urlToImage: 'https://placehold.co/600x400/1e293b/ffffff?text=FinTech',
            url: '#',
            category: 'technology',
            publishedAt: '2024-07-28T11:20:00Z'
        },
        {
            title: 'A Beginner\'s Guide to Understanding Cryptocurrency Volatility',
            description: 'The crypto market is known for its dramatic price swings. This guide breaks down the factors behind the volatility and offers tips for managing risk.',
            urlToImage: 'https://placehold.co/600x400/1e293b/ffffff?text=Crypto+Guide',
            url: '#',
            category: 'investing',
            publishedAt: '2024-07-27T16:00:00Z'
        },
         {
            title: 'How to Build a Diversified Investment Portfolio from Scratch',
            description: 'Diversification is key to long-term investment success. Learn the steps to build a well-balanced portfolio that aligns with your financial goals and risk tolerance.',
            urlToImage: 'https://placehold.co/600x400/1e293b/ffffff?text=Portfolio',
            url: '#',
            category: 'investing',
            publishedAt: '2024-07-27T09:00:00Z'
        }
    ];

    // --- Render Articles ---
    const renderArticles = (articles) => {
        if (!articlesGrid) return;
        articlesGrid.innerHTML = ''; // Clear existing articles

        if (articles.length === 0) {
            articlesGrid.innerHTML = '<p class="col-span-full text-center text-slate-400">No articles found matching your criteria.</p>';
            return;
        }

        articles.forEach(article => {
            const articleCard = document.createElement('article');
            articleCard.className = 'article-card';
            articleCard.innerHTML = `
                <div class="card-image-container">
                    <img src="${article.urlToImage}" alt="${article.title}" class="card-image">
                </div>
                <div class="card-content">
                    <span class="article-category">${article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-description">${article.description}</p>
                    <a href="${article.url}" target="_blank" class="btn btn-secondary btn-sm">Read Full Story <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            articlesGrid.appendChild(articleCard);
        });
    };

    // --- Filter and Search Logic ---
    const filterAndRender = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeCategory = document.querySelector('.category-filter.active')?.dataset.category || 'all';

        let filteredArticles = dummyNewsData;

        // Filter by category
        if (activeCategory !== 'all') {
            filteredArticles = filteredArticles.filter(article => article.category === activeCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filteredArticles = filteredArticles.filter(article => 
                article.title.toLowerCase().includes(searchTerm) || 
                article.description.toLowerCase().includes(searchTerm)
            );
        }

        renderArticles(filteredArticles);
    };

    // --- Event Listeners ---
    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                document.querySelector('.category-filter.active').classList.remove('active');
                filter.classList.add('active');
                filterAndRender();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAndRender);
    }

    // --- Initial Render ---
    renderArticles(dummyNewsData);
});
