
document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar Navigation and Toggle ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');

            contentSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // --- Profile Dropdown ---
    const profileBtn = document.querySelector('.profile-btn');
    const profileDropdown = document.querySelector('.profile-dropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', () => {
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }

    // --- AI Chatbot FAB ---
    const aiFab = document.querySelector('.ai-fab');
    const aiWidget = document.querySelector('.ai-widget-floating');
    const widgetClose = document.querySelector('.widget-close');

    if (aiFab) {
        aiFab.addEventListener('click', () => {
            aiWidget.classList.add('active');
        });
    }

    if (widgetClose) {
        widgetClose.addEventListener('click', () => {
            aiWidget.classList.remove('active');
        });
    }

    // --- Chart.js Initializations ---
    // Investment Mix Chart
    const investmentMixCtx = document.getElementById('investment-mix-chart');
    if (investmentMixCtx) {
        new Chart(investmentMixCtx, {
            type: 'doughnut',
            data: {
                labels: ['Stocks', 'Bonds', 'Real Estate', 'Crypto'],
                datasets: [{
                    data: [50, 25, 15, 10],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            boxWidth: 12,
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // Performance Chart
    const performanceCtx = document.getElementById('performance-chart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [65000, 65500, 67000, 66500, 68000, 69000, 71000],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // --- Recent Transactions Toggle ---
    const transactionToggleBtns = document.querySelectorAll('.transaction-toggle-btn');
    const transactionLists = document.querySelectorAll('.transaction-list');

    transactionToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            transactionToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            transactionLists.forEach(list => {
                if (list.id === targetId) {
                    list.classList.remove('hidden');
                } else {
                    list.classList.add('hidden');
                }
            });
        });
    });
});
