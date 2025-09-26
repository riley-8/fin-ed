document.addEventListener('DOMContentLoaded', () => {
    const topicsList = document.getElementById('topics-list');
    const recentPostsList = document.getElementById('recent-posts-list');
    const newTopicBtn = document.getElementById('new-topic-btn');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    const topics = [
        { id: 1, title: 'General Discussion' },
        { id: 2, title: 'Investing Strategies' },
        { id: 3, title: 'Budgeting Tips' },
        { id: 4, title: 'Cybersecurity Best Practices' },
    ];

    const recentPosts = [
        { id: 1, topicId: 2, title: 'What\'s the best way to start investing in stocks?' },
        { id: 2, topicId: 3, title: 'How to create a budget that actually works' },
        { id: 3, topicId: 4, title: 'Beware of this new phishing scam' },
    ];

    const renderTopics = () => {
        topicsList.innerHTML = '';
        topics.forEach(topic => {
            const li = document.createElement('li');
            li.textContent = topic.title;
            topicsList.appendChild(li);
        });
    };

    const renderRecentPosts = () => {
        recentPostsList.innerHTML = '';
        recentPosts.forEach(post => {
            const li = document.createElement('li');
            li.textContent = post.title;
            recentPostsList.appendChild(li);
        });
    };

    newTopicBtn.addEventListener('click', () => {
        alert('Create New Topic functionality will be implemented in the future.');
    });

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        alert(`Searching for "${searchTerm}" will be implemented in the future.`);
    });

    renderTopics();
    renderRecentPosts();
});
