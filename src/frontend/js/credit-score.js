// In a real application, you would fetch this data from a secure API.
const creditScoreData = {
    score: 720,
    rating: 'Good',
    factors: [
        { name: 'Payment History', status: 'Excellent' },
        { name: 'Credit Utilization', status: 'Good' },
        { name: 'Length of Credit History', status: 'Fair' },
        { name: 'New Credit', status: 'Good' },
        { name: 'Credit Mix', status: 'Excellent' },
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const scoreElement = document.querySelector('.credit-score-widget .score');
    const ratingElement = document.querySelector('.credit-score-widget .rating');
    const factorsList = document.querySelector('.credit-factors ul');

    scoreElement.textContent = creditScoreData.score;
    ratingElement.textContent = creditScoreData.rating;

    creditScoreData.factors.forEach(factor => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${factor.name} <span>${factor.status}</span>`;
        factorsList.appendChild(listItem);
    });
});
