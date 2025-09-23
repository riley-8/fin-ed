const API_URL = 'http://localhost:5000/api';

const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const app = document.getElementById('app');

let authToken = localStorage.getItem('authToken');

// --- AUTHENTICATION LOGIC ---

const showRegister = (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
};

const showLogin = (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
};

const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            initializeApp();
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.token) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            initializeApp();
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration.');
    }
};

const handleLogout = () => {
    authToken = null;
    localStorage.removeItem('authToken');
    authContainer.style.display = 'block';
    appContainer.style.display = 'none';
};

// --- ROUTING & RENDERING ---

const router = {
    '#dashboard': {
        fetch: () => fetchData('dashboard'),
        render: (data) => renderDashboard(data)
    },
    '#profile': {
        fetch: () => fetchData('profile'),
        render: (data) => renderProfile(data)
    },
    '#scenarios': {
        render: () => renderScenarioSimulator()
    },
    '#lessons': {
        fetch: () => fetchData('lessons'),
        render: (data) => `<h2>Lessons</h2><pre>${JSON.stringify(data, null, 2)}</pre>`
    },
    '#challenges': {
        fetch: () => fetchData('challenges'),
        render: (data) => `<h2>Challenges</h2><pre>${JSON.stringify(data, null, 2)}</pre>`
    },
    '#chatbot': {
        render: () => renderChatbot()
    },
    '#gamification': {
        fetch: () => Promise.all([
            fetchData('gamification/leaderboard'),
            fetchData('gamification/badges'),
            fetchData('gamification/rewards')
        ]),
        render: ([leaderboard, badges, rewards]) => renderGamification(leaderboard, badges, rewards)
    },
};

async function fetchData(endpoint, options = {}) {
    const defaultOptions = {
        headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };
    const res = await fetch(`${API_URL}/${endpoint}`, { ...defaultOptions, ...options });
    if (res.status === 401) {
        handleLogout();
        return null;
    }
    if (res.status === 204 || res.status === 200 && res.headers.get('content-length') === '0') { // Handle no content
        return null;
    }
    return await res.json();
}

function renderDashboard(data) {
    if (!data) return '';

    const financialOverview = data.financial_overview || {};
    const overviewHTML = `
        <div class="dashboard-section">
            <h3>Financial Overview</h3>
            <div class="card">
                <p><strong>Income:</strong> R ${financialOverview.income || 0}</p>
                <p><strong>Expenses:</strong> R ${financialOverview.expenses || 0}</p>
                <p><strong>Savings:</strong> R ${financialOverview.savings || 0}</p>
            </div>
        </div>
    `;

    const goalsHTML = `
        <div class="dashboard-section">
            <h3>Active Goals</h3>
            ${data.active_goals && data.active_goals.length > 0 ? 
                data.active_goals.map(goal => `
                    <div class="card">
                        <p><strong>${goal.goal_type}</strong></p>
                        <p>Target: R ${goal.target_amount}</p>
                        <p>Current: R ${goal.current_amount}</p>
                        <progress value="${goal.current_amount}" max="${goal.target_amount}"></progress>
                    </div>
                `).join('') : 
                '<p>No active goals set.</p>' 
            }
        </div>
    `;

    return `
        <h2>Dashboard</h2>
        <p>Welcome, ${data.username}!</p>
        <div class="dashboard-grid">
            ${overviewHTML}
            ${goalsHTML}
        </div>
    `;
}

function renderProfile(data) {
    const { budget, goals } = data;

    return `
        <h2>Profile</h2>
        <div class="profile-grid">
            <div class="profile-section">
                <h3>Budget</h3>
                <div class="card">
                    <form id="budget-form">
                        <label>Monthly Income:</label>
                        <input type="number" id="budget-income" value="${budget.income || ''}" required>
                        <label>Monthly Expenses (JSON):</label>
                        <textarea id="budget-expenses">${JSON.stringify(budget.expenses_json || {}, null, 2)}</textarea>
                        <button type="submit">Update Budget</button>
                    </form>
                </div>
            </div>
            <div class="profile-section">
                <h3>Financial Goals</h3>
                <div id="goals-list">
                    ${goals.map(goal => `
                        <div class="card">
                            <p><strong>${goal.goal_type}</strong> - Target: R ${goal.target_amount}</p>
                            <button class="delete-goal-btn" data-id="${goal.id}">Delete</button>
                        </div>
                    `).join('')}
                </div>
                <div class="card">
                     <h4>Add New Goal</h4>
                    <form id="add-goal-form">
                        <input type="text" id="goal-type" placeholder="Goal Type (e.g., Savings)" required>
                        <input type="number" id="goal-target" placeholder="Target Amount" required>
                        <input type="date" id="goal-date" required>
                        <button type="submit">Add Goal</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function renderGamification(leaderboard, badges, rewards) {
    const leaderboardHTML = `
        <div class="gamification-section">
            <h3>Leaderboard</h3>
            <ol class="leaderboard-list">
                ${leaderboard.map(user => `<li><span>${user.username}</span><span>${user.points} pts</span></li>`).join('')}
            </ol>
        </div>
    `;

    const badgesHTML = `
        <div class="gamification-section">
            <h3>My Badges</h3>
            <div class="badge-collection">
                ${badges.map(badge => `
                    <div class="badge card" title="${badge.description}">
                        <span class="badge-icon">${badge.icon || '&#127894;'}</span>
                        <p>${badge.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const rewardsHTML = `
        <div class="gamification-section">
            <h3>Rewards Store</h3>
            <div class="rewards-store">
                ${rewards.map(reward => `
                    <div class="reward card">
                        <p><strong>${reward.name}</strong></p>
                        <p>${reward.description}</p>
                        <button class="buy-reward-btn" data-id="${reward.id}">${reward.cost} Points</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    return `
        <h2>Gamification</h2>
        <div class="gamification-grid">
            ${leaderboardHTML}
            ${badgesHTML}
            ${rewardsHTML}
        </div>
    `;
}

function renderChatbot() {
    return `
        <h2>AI Financial Coach</h2>
        <div id="chat-container">
            <div id="chat-history"></div>
            <input type="text" id="chat-input" placeholder="Ask me anything about your finances...">
            <button id="chat-submit">Send</button>
        </div>
    `;
}

function renderScenarioSimulator() {
    return `
    <h2>Financial Scenario Simulator</h2>
    <div class="scenario-grid">
        <div class="scenario-section card">
            <h3>Investment Growth</h3>
            <form id="investment-sim-form">
                <label>Current Savings (R):</label>
                <input type="number" id="sim-current-savings" value="1000">
                <label>Monthly Contribution (R):</label>
                <input type="number" id="sim-monthly-contrib" value="100">
                <label>Estimated Annual Return (%):</label>
                <input type="number" id="sim-annual-return" value="5">
                <label>Number of Years:</label>
                <input type="number" id="sim-years" value="10">
                <button type="submit">Simulate</button>
            </form>
        </div>
        <div class="scenario-section card">
            <h3>Simulation Result</h3>
            <div id="simulation-result">
                <p>Enter your details and run a simulation to see the potential growth of your investments.</p>
            </div>
        </div>
    </div>
    `;
}

async function handleRouteChange() {
    if (!authToken) return;
    const hash = window.location.hash || '#dashboard';
    const route = router[hash];

    if (route) {
        app.innerHTML = '<h2>Loading...</h2>';
        try {
            const data = route.fetch ? await route.fetch() : null;
            if(data) {
                app.innerHTML = route.render(Array.isArray(data) ? data : data);
            } else if (!route.fetch) {
                app.innerHTML = route.render();
            }
            
            // Add event listeners for the current page
            if (hash === '#profile') addProfileEventListeners();
            if (hash === '#scenarios') addScenarioEventListeners();
            if (hash === '#chatbot') addChatbotEventListeners();

        } catch (error) {
            console.error('Routing error:', error);
            app.innerHTML = '<h2>Error loading page</h2>';
        }
    }
}

async function handleChatSubmit() {
    const input = document.getElementById('chat-input');
    const history = document.getElementById('chat-history');
    const message = input.value;

    if (!message) return;

    history.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    history.scrollTop = history.scrollHeight;
    input.value = '';

    const res = await fetch(`${API_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ message })
    });

    const { reply } = await res.json();
    history.innerHTML += `<p><strong>AI:</strong> ${reply}</p>`;
    history.scrollTop = history.scrollHeight;
}

function addProfileEventListeners() {
    const budgetForm = document.getElementById('budget-form');
    if(budgetForm) {
        budgetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const income = document.getElementById('budget-income').value;
            const expenses_json = JSON.parse(document.getElementById('budget-expenses').value);
            
            await fetchData('profile/budget', { 
                method: 'POST', 
                body: JSON.stringify({ income, expenses_json })
            });
            
            alert('Budget updated!');
            window.location.hash = '#dashboard'; // Refresh dashboard
        });
    }

    const addGoalForm = document.getElementById('add-goal-form');
    if(addGoalForm) {
        addGoalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const goal_type = document.getElementById('goal-type').value;
            const target_amount = document.getElementById('goal-target').value;
            const target_date = document.getElementById('goal-date').value;

            await fetchData('profile/goals', { 
                method: 'POST', 
                body: JSON.stringify({ goal_type, target_amount, target_date })
            });

            handleRouteChange(); // Refresh profile page
        });
    }

    const deleteButtons = document.querySelectorAll('.delete-goal-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const goalId = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this goal?')) {
                await fetchData(`profile/goals/${goalId}`, { method: 'DELETE' });
                handleRouteChange(); // Refresh profile page
            }
        });
    });
}

function addChatbotEventListeners() {
    const chatSubmit = document.getElementById('chat-submit');
    if (chatSubmit) {
        chatSubmit.addEventListener('click', handleChatSubmit);
    }

    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleChatSubmit();
            }
        });
    }
}

function addScenarioEventListeners() {
    const simForm = document.getElementById('investment-sim-form');
    if (simForm) {
        simForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                currentSavings: document.getElementById('sim-current-savings').value,
                monthlyContribution: document.getElementById('sim-monthly-contrib').value,
                annualReturn: document.getElementById('sim-annual-return').value / 100,
                years: document.getElementById('sim-years').value,
            };

            const result = await fetchData('scenarios/simulate', { 
                method: 'POST', 
                body: JSON.stringify(data)
            });

            if (result) {
                document.getElementById('simulation-result').innerHTML = `<p>${result.message}</p>`;
            }
        });
    }
}


// --- INITIALIZATION ---

function initializeApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';

    document.getElementById('logout-button').addEventListener('click', handleLogout);
    window.addEventListener('hashchange', handleRouteChange);
    
    handleRouteChange(); // Initial route
}

if (authToken) {
    initializeApp();
} else {
    authContainer.style.display = 'block';
    appContainer.style.display = 'none';
}

document.getElementById('show-register').addEventListener('click', showRegister);
document.getElementById('show-login').addEventListener('click', showLogin);
document.getElementById('login-button').addEventListener('click', handleLogin);
document.getElementById('register-button').addEventListener('click', handleRegister);
