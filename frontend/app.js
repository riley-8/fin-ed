document.addEventListener('DOMContentLoaded', () => {
    const budgetForm = document.getElementById('budget-form');
    const onboardingDiv = document.getElementById('onboarding');
    const dashboardDiv = document.getElementById('dashboard');
    const healthScoreEl = document.getElementById('health-score');
    const savingsProgressEl = document.getElementById('savings-progress');
    const budgetChartCanvas = document.getElementById('budget-chart').getContext('2d');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const chatWindow = document.getElementById('chat-window');

    let budgetChart;

    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(budgetForm);
        const income = parseFloat(formData.get('salary')) + parseFloat(formData.get('other-income'));
        const expenses = {
            rent: parseFloat(formData.get('rent')),
            food: parseFloat(formData.get('food')),
            transport: parseFloat(formData.get('transport')),
            utilities: parseFloat(formData.get('utilities')),
            entertainment: parseFloat(formData.get('entertainment')),
            'debt-payments': parseFloat(formData.get('debt-payments')),
            other: parseFloat(formData.get('other'))
        };

        analyzeBudget(income, expenses);

        onboardingDiv.classList.add('hidden');
        dashboardDiv.classList.remove('hidden');
    });

    function analyzeBudget(income, expenses) {
        const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
        const savings = income - totalExpenses;
        const savingsRate = (savings / income) * 100;

        // Update Financial Health Score
        let healthScore = 0;
        if (savingsRate >= 20) {
            healthScore = 85;
            healthScoreEl.className = 'text-5xl font-bold text-center text-green-500';
        } else if (savingsRate >= 10) {
            healthScore = 60;
            healthScoreEl.className = 'text-5xl font-bold text-center text-yellow-500';
        } else {
            healthScore = 30;
            healthScoreEl.className = 'text-5xl font-bold text-center text-red-500';
        }
        healthScoreEl.textContent = Math.round(healthScore);

        // Update Savings Progress
        savingsProgressEl.style.width = `${Math.min(savingsRate, 100)}%`;

        // Update Budget Breakdown Chart
        if (budgetChart) {
            budgetChart.destroy();
        }
        budgetChart = new Chart(budgetChartCanvas, {
            type: 'doughnut',
            data: {
                labels: [...Object.keys(expenses), 'Savings'],
                datasets: [{
                    data: [...Object.values(expenses), savings],
                    backgroundColor: ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#22d3ee', '#818cf8', '#d946ef'],
                }]
            }
        });
    }

    sendChatBtn.addEventListener('click', () => {
        const userMessage = chatInput.value;
        if (userMessage.trim() === '') return;

        appendMessage('user', userMessage);
        chatInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            appendMessage('ai', 'I am a humble AI assistant. I am still learning and cannot provide financial advice.');
        }, 1000);
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('mb-2', sender === 'user' ? 'text-right' : 'text-left');
        messageElement.innerHTML = `
            <div class="inline-block p-2 rounded-lg ${sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}">
                ${message}
            </div>
        `;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});