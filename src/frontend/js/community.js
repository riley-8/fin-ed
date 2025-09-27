// community.js - Community page functionality

// Community data structure
let communityData = {
    discussions: [],
    leaderboard: [],
    mentors: [],
    currentUser: {
        id: 1,
        name: "Current User",
        avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%232563eb'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E",
        score: 850,
        joinedChallenges: []
    },
    weeklyChallenge: {
        id: 1,
        title: "Secure Your Digital Identity",
        description: "Complete all identity protection modules and share your experience",
        progress: 45,
        participants: 1247
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityPage();
    setupEventListeners();
});

// Initialize community page with data
function initializeCommunityPage() {
    // Generate sample data if none exists
    if (communityData.discussions.length === 0) {
        generateSampleData();
    }
    
    // Render components
    renderLeaderboard();
    renderDiscussions();
    updateChallengeProgress();
}

// Set up event listeners
function setupEventListeners() {
    // New topic button
    const newTopicBtn = document.getElementById('newTopicBtn');
    const topicForm = document.getElementById('topicForm');
    const cancelTopicBtn = document.getElementById('cancelTopicBtn');
    
    if (newTopicBtn) {
        newTopicBtn.addEventListener('click', function() {
            topicForm.classList.remove('hidden');
            newTopicBtn.style.display = 'none';
        });
    }
    
    if (cancelTopicBtn) {
        cancelTopicBtn.addEventListener('click', function() {
            topicForm.classList.add('hidden');
            newTopicBtn.style.display = 'flex';
            document.getElementById('topicTitle').value = '';
            document.getElementById('topicContent').value = '';
        });
    }
    
    // Topic form submission
    if (topicForm) {
        topicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewTopic();
        });
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter discussions
            const filter = this.getAttribute('data-filter');
            filterDiscussions(filter);
        });
    });
    
    // Join challenge button
    const joinChallengeBtn = document.getElementById('joinChallengeBtn');
    if (joinChallengeBtn) {
        joinChallengeBtn.addEventListener('click', joinChallenge);
    }
    
    // Find mentor button
    const findMentorBtn = document.getElementById('findMentorBtn');
    if (findMentorBtn) {
        findMentorBtn.addEventListener('click', findMentor);
    }
}

// Generate sample community data
function generateSampleData() {
    // Sample discussions
    communityData.discussions = [
        {
            id: 1,
            title: "How to protect against phishing attacks?",
            content: "I recently received an email that looked like it was from my bank, but something felt off. What are the best practices to identify and avoid phishing attempts?",
            author: {
                id: 2,
                name: "Security Enthusiast",
                avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2310b981'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E",
                score: 920
            },
            date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            upvotes: 24,
            downvotes: 2,
            answers: 8,
            tags: ["Security", "Phishing", "Education"],
            userVote: 0 // 0 = no vote, 1 = upvote, -1 = downvote
        },
        {
            id: 2,
            title: "Best practices for creating a strong password?",
            content: "I know I should use strong passwords, but I struggle to remember them. What are some techniques for creating secure yet memorable passwords?",
            author: {
                id: 3,
                name: "Password Learner",
                avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23f59e0b'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E",
                score: 760
            },
            date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            upvotes: 18,
            downvotes: 1,
            answers: 12,
            tags: ["Security", "Passwords", "Best Practices"],
            userVote: 0
        },
        {
            id: 3,
            title: "How to start investing with a small budget?",
            content: "I want to start investing but only have a small amount to begin with. What are some good options for beginners with limited funds?",
            author: {
                id: 4,
                name: "Investment Newbie",
                avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23ef4444'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E",
                score: 680
            },
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            upvotes: 32,
            downvotes: 3,
            answers: 15,
            tags: ["Investing", "Beginners", "Budgeting"],
            userVote: 0
        }
    ];
    
    // Sample leaderboard
    communityData.leaderboard = [
        { id: 5, name: "Finance Guru", score: 1250, avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23f59e0b'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E" },
        { id: 6, name: "Security Expert", score: 1180, avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2310b981'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E" },
        { id: 7, name: "Investment Pro", score: 1120, avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%232563eb'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E" },
        { id: 8, name: "Budget Master", score: 1050, avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%238b5cf6'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E" },
        { id: 9, name: "Credit Wizard", score: 980, avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23ec4899'/%3E%3Ccircle cx='16' cy='12' r='5' fill='white'/%3E%3Cpath d='M16,22c-5,0-9,3-9,7c0,0,0,0,0,0h18c0-4-4-7-9-7z' fill='white'/%3E%3C/svg%3E" }
    ];
    
    // Sample mentors
    communityData.mentors = [
        {
            id: 10,
            name: "Alex Morgan",
            title: "Cybersecurity Specialist",
            expertise: ["Phishing Prevention", "Data Protection", "Security Training"],
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%2310b981'/%3E%3Ccircle cx='30' cy='22' r='8' fill='white'/%3E%3Cpath d='M30,42c-8,0-15,5-15,12c0,0,0,0,0,0h30c0-7-7-12-15-12z' fill='white'/%3E%3C/svg%3E",
            bio: "10+ years experience in cybersecurity with focus on financial institutions"
        },
        {
            id: 11,
            name: "Sarah Johnson",
            title: "Financial Advisor",
            expertise: ["Investment Strategies", "Retirement Planning", "Risk Management"],
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%232563eb'/%3E%3Ccircle cx='30' cy='22' r='8' fill='white'/%3E%3Cpath d='M30,42c-8,0-15,5-15,12c0,0,0,0,0,0h30c0-7-7-12-15-12z' fill='white'/%3E%3C/svg%3E",
            bio: "Certified financial planner specializing in helping beginners start their investment journey"
        },
        {
            id: 12,
            name: "Michael Chen",
            title: "Fintech Entrepreneur",
            expertise: ["Digital Banking", "Budgeting Apps", "Financial Literacy"],
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%23f59e0b'/%3E%3Ccircle cx='30' cy='22' r='8' fill='white'/%3E%3Cpath d='M30,42c-8,0-15,5-15,12c0,0,0,0,0,0h30c0-7-7-12-15-12z' fill='white'/%3E%3C/svg%3E",
            bio: "Founder of two successful fintech startups, passionate about financial education"
        }
    ];
}

// Render leaderboard
function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    
    communityData.leaderboard.forEach((user, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'leaderboard-item';
        
        listItem.innerHTML = `
            <span class="leaderboard-rank">${index + 1}</span>
            <div class="leaderboard-user">
                <img src="${user.avatar}" alt="${user.name}" class="user-avatar-small">
                <span>${user.name}</span>
            </div>
            <span class="leaderboard-score">${user.score}</span>
        `;
        
        leaderboardList.appendChild(listItem);
    });
}

// Render discussions
function renderDiscussions(filteredDiscussions = null) {
    const discussionList = document.getElementById('discussionList');
    if (!discussionList) return;
    
    discussionList.innerHTML = '';
    
    const discussions = filteredDiscussions || communityData.discussions;
    
    discussions.forEach(discussion => {
        const discussionItem = document.createElement('article');
        discussionItem.className = 'discussion-item';
        discussionItem.dataset.id = discussion.id;
        
        // Format date
        const dateString = formatDiscussionDate(discussion.date);
        
        discussionItem.innerHTML = `
            <header class="discussion-header-small">
                <div class="discussion-author">
                    <img src="${discussion.author.avatar}" alt="${discussion.author.name}" class="user-avatar-small">
                    <div class="discussion-meta">
                        <span class="discussion-author-name">${discussion.author.name}</span>
                        <span class="discussion-date">${dateString}</span>
                    </div>
                </div>
                <div class="discussion-stats">
                    <span class="discussion-stat">
                        <i class="fas fa-arrow-up"></i> ${discussion.upvotes}
                    </span>
                    <span class="discussion-stat">
                        <i class="fas fa-comments"></i> ${discussion.answers}
                    </span>
                </div>
            </header>
            <h3 class="discussion-title">${discussion.title}</h3>
            <p class="discussion-content">${discussion.content}</p>
            <div class="discussion-tags">
                ${discussion.tags.map(tag => `<span class="discussion-tag">${tag}</span>`).join('')}
            </div>
            <div class="discussion-actions">
                <button class="vote-btn upvote ${discussion.userVote === 1 ? 'active' : ''}" data-id="${discussion.id}" data-type="upvote">
                    <i class="fas fa-arrow-up"></i> Upvote
                </button>
                <button class="vote-btn downvote ${discussion.userVote === -1 ? 'active' : ''}" data-id="${discussion.id}" data-type="downvote">
                    <i class="fas fa-arrow-down"></i> Downvote
                </button>
                <button class="vote-btn" data-id="${discussion.id}">
                    <i class="fas fa-comment"></i> Answer
                </button>
            </div>
        `;
        
        discussionList.appendChild(discussionItem);
    });
    
    // Add event listeners to vote buttons
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', handleVote);
    });
}

// Format discussion date
function formatDiscussionDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
}

// Handle voting on discussions
function handleVote(e) {
    const button = e.currentTarget;
    const discussionId = parseInt(button.dataset.id);
    const voteType = button.dataset.type;
    
    if (!voteType) return; // Skip if it's not a vote button
    
    const discussion = communityData.discussions.find(d => d.id === discussionId);
    if (!discussion) return;
    
    // Determine new vote state
    let newVoteState = 0;
    if (voteType === 'upvote') {
        newVoteState = discussion.userVote === 1 ? 0 : 1;
    } else if (voteType === 'downvote') {
        newVoteState = discussion.userVote === -1 ? 0 : -1;
    }
    
    // Update vote counts
    if (discussion.userVote === 1 && newVoteState !== 1) {
        discussion.upvotes--;
    } else if (discussion.userVote === -1 && newVoteState !== -1) {
        discussion.downvotes--;
    }
    
    if (newVoteState === 1 && discussion.userVote !== 1) {
        discussion.upvotes++;
        if (discussion.userVote === -1) discussion.downvotes--;
    } else if (newVoteState === -1 && discussion.userVote !== -1) {
        discussion.downvotes++;
        if (discussion.userVote === 1) discussion.upvotes--;
    }
    
    discussion.userVote = newVoteState;
    
    // Update UI
    renderDiscussions();
}

// Filter discussions based on selected filter
function filterDiscussions(filter) {
    let filteredDiscussions = [...communityData.discussions];
    
    switch(filter) {
        case 'popular':
            filteredDiscussions.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
            break;
        case 'recent':
            filteredDiscussions.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'unanswered':
            filteredDiscussions = filteredDiscussions.filter(d => d.answers === 0);
            break;
        default:
            // 'all' - no filtering needed
            break;
    }
    
    renderDiscussions(filteredDiscussions);
}

// Create a new discussion topic
function createNewTopic() {
    const titleInput = document.getElementById('topicTitle');
    const contentInput = document.getElementById('topicContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }
    
    // Create new discussion
    const newDiscussion = {
        id: communityData.discussions.length + 1,
        title: title,
        content: content,
        author: {
            id: communityData.currentUser.id,
            name: communityData.currentUser.name,
            avatar: communityData.currentUser.avatar,
            score: communityData.currentUser.score
        },
        date: new Date(),
        upvotes: 0,
        downvotes: 0,
        answers: 0,
        tags: ["New"],
        userVote: 0
    };
    
    // Add to beginning of discussions array
    communityData.discussions.unshift(newDiscussion);
    
    // Reset form
    titleInput.value = '';
    contentInput.value = '';
    document.getElementById('topicForm').classList.add('hidden');
    document.getElementById('newTopicBtn').style.display = 'flex';
    
    // Re-render discussions
    renderDiscussions();
    
    // Show success message
    showNotification('Discussion created successfully!', 'success');
}

// Join weekly challenge
function joinChallenge() {
    const joinBtn = document.getElementById('joinChallengeBtn');
    
    if (communityData.currentUser.joinedChallenges.includes(communityData.weeklyChallenge.id)) {
        showNotification('You have already joined this challenge!', 'info');
        return;
    }
    
    communityData.currentUser.joinedChallenges.push(communityData.weeklyChallenge.id);
    communityData.weeklyChallenge.participants++;
    
    joinBtn.textContent = 'Joined Challenge';
    joinBtn.disabled = true;
    
    showNotification('Successfully joined the weekly challenge!', 'success');
    
    // Update progress display
    updateChallengeProgress();
}

// Update challenge progress display
function updateChallengeProgress() {
    const progressBar = document.getElementById('challengeProgress');
    if (!progressBar) return;
    
    const isJoined = communityData.currentUser.joinedChallenges.includes(communityData.weeklyChallenge.id);
    const progress = isJoined ? communityData.weeklyChallenge.progress : 0;
    
    progressBar.style.width = `${progress}%`;
    progressBar.nextElementSibling.textContent = `${progress}% completed`;
}

// Find a mentor
function findMentor() {
    const mentorResult = document.getElementById('mentorMatchResult');
    if (!mentorResult) return;
    
    // Randomly select a mentor
    const randomMentor = communityData.mentors[Math.floor(Math.random() * communityData.mentors.length)];
    
    mentorResult.innerHTML = `
        <div class="mentor-profile">
            <img src="${randomMentor.avatar}" alt="${randomMentor.name}" class="mentor-avatar">
            <div class="mentor-info">
                <h4>${randomMentor.name}</h4>
                <p>${randomMentor.title}</p>
                <p>${randomMentor.bio}</p>
                <div class="mentor-specialties">
                    ${randomMentor.expertise.map(specialty => `<span class="mentor-specialty">${specialty}</span>`).join('')}
                </div>
            </div>
        </div>
        <button class="btn btn-primary" style="margin-top: 1rem;">Connect with ${randomMentor.name.split(' ')[0]}</button>
    `;
    
    mentorResult.classList.add('active');
    
    // Add event listener to connect button
    const connectBtn = mentorResult.querySelector('button');
    if (connectBtn) {
        connectBtn.addEventListener('click', function() {
            showNotification(`Connection request sent to ${randomMentor.name}!`, 'success');
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-md);
                color: white;
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            .notification-info { background: var(--primary-color); }
            .notification-success { background: var(--success-color); }
            .notification-warning { background: var(--warning-color); }
            .notification-error { background: var(--danger-color); }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}