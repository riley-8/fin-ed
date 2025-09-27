
document.addEventListener('DOMContentLoaded', () => {
    // --- Credit Score Gauge Chart ---
    const score = 780; // Example score
    const maxScore = 850; // Typically the max score

    const gaugeChartCtx = document.getElementById('credit-score-gauge')?.getContext('2d');
    const scoreValueEl = document.getElementById('credit-score-value');
    const scoreRatingEl = document.getElementById('credit-score-rating');

    if (scoreValueEl) {
        scoreValueEl.textContent = score;
    }

    if (scoreRatingEl) {
        // Determine rating based on score
        let rating = 'Poor';
        if (score >= 800) rating = 'Excellent';
        else if (score >= 740) rating = 'Very Good';
        else if (score >= 670) rating = 'Good';
        else if (score >= 580) rating = 'Fair';
        scoreRatingEl.textContent = rating;
    }

    if (gaugeChartCtx) {
        const data = {
            datasets: [{
                data: [score, maxScore - score],
                backgroundColor: [
                    '#4CAF50', // Color for the score
                    '#E0E0E0'  // Color for the remaining part
                ],
                borderColor: '#ffffff',
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
            }]
        };

        new Chart(gaugeChartCtx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // --- Interactive Factor Explanations ---
    const factorItems = document.querySelectorAll('.factor-item');
    factorItems.forEach(item => {
        item.addEventListener('click', () => {
            const info = item.querySelector('.factor-info');
            if (info) {
                // Simple toggle for demonstration
                const isVisible = info.style.display === 'block';
                document.querySelectorAll('.factor-info').forEach(i => i.style.display = 'none');
                info.style.display = isVisible ? 'none' : 'block';
            }
        });
    });
});
