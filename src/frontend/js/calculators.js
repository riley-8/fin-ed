document.getElementById('savings-calculator').addEventListener('submit', function(event) {
    event.preventDefault();

    const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
    const years = parseFloat(document.getElementById('years').value) || 0;

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfMonths = years * 12;

    let futureValue = initialInvestment * Math.pow(1 + monthlyInterestRate, numberOfMonths);

    for (let i = 0; i < numberOfMonths; i++) {
        futureValue += monthlyContribution * Math.pow(1 + monthlyInterestRate, i);
    }

    document.getElementById('future-value').textContent = `R${futureValue.toFixed(2)}`;
});
