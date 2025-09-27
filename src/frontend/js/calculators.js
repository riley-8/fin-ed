
document.addEventListener('DOMContentLoaded', () => {
    const calculatorTabs = document.querySelectorAll('.calculator-tabs .tab-btn');
    const calculatorContents = document.querySelectorAll('.calculator-content');

    calculatorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');

            calculatorTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            calculatorContents.forEach(content => {
                if (content.id === targetId) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
});

function calculateLoan() {
    const principal = parseFloat(document.getElementById('loan-principal').value);
    const interestRate = parseFloat(document.getElementById('loan-interest').value) / 100 / 12;
    const tenure = parseFloat(document.getElementById('loan-tenure').value) * 12;

    if (principal && interestRate && tenure) {
        const emi = (principal * interestRate * Math.pow(1 + interestRate, tenure)) / (Math.pow(1 + interestRate, tenure) - 1);
        document.getElementById('loan-result').textContent = `Monthly EMI: R${emi.toFixed(2)}`;
    }
}

function calculateInvestment() {
    const principal = parseFloat(document.getElementById('investment-principal').value);
    const rate = parseFloat(document.getElementById('investment-interest').value) / 100;
    const years = parseFloat(document.getElementById('investment-years').value);
    const compounding = parseFloat(document.getElementById('investment-compounding').value);

    if (principal && rate && years && compounding) {
        const futureValue = principal * Math.pow(1 + rate / compounding, compounding * years);
        document.getElementById('investment-result').textContent = `Future Value: R${futureValue.toFixed(2)}`;
    }
}
