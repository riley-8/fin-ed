
document.addEventListener('DOMContentLoaded', () => {
    // Budget setup modal
    const setupBudgetBtn = document.getElementById('setup-budget-btn');
    const budgetModal = document.getElementById('budget-modal');
    const closeModal = document.querySelector('.modal-close');

    if (setupBudgetBtn && budgetModal) {
        setupBudgetBtn.addEventListener('click', () => {
            budgetModal.style.display = 'flex';
        });
    }

    if (closeModal && budgetModal) {
        closeModal.addEventListener('click', () => {
            budgetModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === budgetModal) {
            budgetModal.style.display = 'none';
        }
    });

    // Chart.js implementation
    const budgetChartCtx = document.getElementById('budget-chart');
    if (budgetChartCtx) {
        new Chart(budgetChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Housing', 'Transport', 'Food', 'Entertainment', 'Savings'],
                datasets: [{
                    data: [30, 15, 20, 10, 25],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
});
