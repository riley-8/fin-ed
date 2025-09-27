
document.addEventListener('DOMContentLoaded', () => {
    // --- Tabbed Navigation for Stocks/Crypto/Other ---
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    const investmentSections = document.querySelectorAll('.investment-section');

    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            viewToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            investmentSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    // --- Chart for Selected Asset ---
    const assetChartCtx = document.getElementById('asset-performance-chart')?.getContext('2d');
    if (assetChartCtx) {
        new Chart(assetChartCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Asset Value',
                    data: [150, 155, 160, 158, 162, 165, 170], // Example data
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // --- Search and Filter Functionality ---
    const searchInput = document.getElementById('investment-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const investmentItems = document.querySelectorAll('.investment-item');

            investmentItems.forEach(item => {
                const name = item.querySelector('h4').textContent.toLowerCase();
                const symbol = item.querySelector('.investment-symbol').textContent.toLowerCase();

                if (name.includes(searchTerm) || symbol.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // --- Trade Modal Simulation ---
    const tradeButtons = document.querySelectorAll('.trade-btn');
    const tradeModal = document.getElementById('trade-modal');
    const closeModal = document.querySelector('.trade-modal-close');
    const tradeForm = document.getElementById('trade-form');
    const assetNameEl = document.getElementById('trade-asset-name');

    tradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const investmentItem = btn.closest('.investment-item');
            const assetName = investmentItem.querySelector('h4').textContent;
            assetNameEl.textContent = assetName; // Set asset name in the modal
            tradeModal.style.display = 'flex';
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            tradeModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === tradeModal) {
            tradeModal.style.display = 'none';
        }
    });

    if (tradeForm) {
        tradeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Trade placed successfully! (Simulation)');
            tradeModal.style.display = 'none';
            tradeForm.reset();
        });
    }
});
