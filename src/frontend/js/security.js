
document.addEventListener('DOMContentLoaded', () => {

    // --- Security Score Donut Chart ---
    const securityScoreCtx = document.getElementById('security-score-chart')?.getContext('2d');
    if (securityScoreCtx) {
        new Chart(securityScoreCtx, {
            type: 'doughnut',
            data: {
                labels: ['Score', 'Remaining'],
                datasets: [{
                    data: [85, 15], // Example Score: 85%
                    backgroundColor: ['#10b981', '#334155'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                }
            }
        });
    }

    // --- Security Settings Toggles ---
    const securityToggles = document.querySelectorAll('.security-setting-toggle');
    securityToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingName = e.target.closest('.security-setting').querySelector('h4').textContent;
            const isEnabled = e.target.checked;
            
            // In a real app, this would trigger an API call.
            console.log(`${settingName} has been ${isEnabled ? 'enabled' : 'disabled'}.`);
            
            // Show a confirmation toast/notification (optional)
            showToast(`${settingName} ${isEnabled ? 'Enabled' : 'Disabled'}.`);
        });
    });

    // --- Recent Activity Filter ---
    const activityFilterInput = document.getElementById('activity-filter');
    if (activityFilterInput) {
        activityFilterInput.addEventListener('input', (e) => {
            const filterValue = e.target.value.toLowerCase();
            const activityItems = document.querySelectorAll('.activity-item');

            activityItems.forEach(item => {
                const description = item.querySelector('p').textContent.toLowerCase();
                if (description.includes(filterValue)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // --- Simple Toast Notification Function ---
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100); 

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }
});
