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
        render: ([leaderboard, badges, rewards]) => `
            <h2>Gamification</h2>
            <h3>Leaderboard</h3>
            <pre>${JSON.stringify(leaderboard, null, 2)}</pre>
            <h3>My Badges</h3>
            <pre>${JSON.stringify(badges, null, 2)}</pre>
            <h3>Rewards Store</h3>
            <pre>${JSON.stringify(rewards, null, 2)}</pre>
        `
    },
};

async function fetchData(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (res.status === 401) {
        handleLogout();
        return null;
    }
    return await res.json();
}

function renderDashboard(data) {
    if (!data) return '';
    return `
        <h2>Dashboard</h2>
        <p>Welcome, ${data.username}!</p>
        <h3>Financial Overview</h3>
        <pre>${JSON.stringify(data.financial_overview, null, 2)}</pre>
        <h3>Active Goals</h3>
        <pre>${JSON.stringify(data.active_goals, null, 2)}</pre>
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

async function handleRouteChange() {
    if (!authToken) return;
    const hash = window.location.hash || '#dashboard';
    const route = router[hash];

    if (route) {
        app.innerHTML = '<h2>Loading...</h2>';
        try {
            const data = route.fetch ? await route.fetch() : null;
            if(data) app.innerHTML = route.render(data);
            else if (!route.fetch) app.innerHTML = route.render();

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

// --- INITIALIZATION ---

function initializeApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';

    document.getElementById('logout-button').addEventListener('click', handleLogout);
    window.addEventListener('hashchange', handleRouteChange);
    app.addEventListener('click', (e) => {
        if (e.target.id === 'chat-submit') {
            handleChatSubmit();
        }
    });
    app.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.id === 'chat-input') {
            handleChatSubmit();
        }
    });
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
