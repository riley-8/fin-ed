document.addEventListener('DOMContentLoaded', () => {
    const incomeForm = document.getElementById('income-form');
    const expenseForm = document.getElementById('expense-form');
    const incomeList = document.getElementById('income-list');
    const expenseList = document.getElementById('expense-list');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const remainingBalanceEl = document.getElementById('remaining-balance');

    let totalIncome = 0;
    let totalExpenses = 0;

    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const source = document.getElementById('income-source').value;
        const amount = parseFloat(document.getElementById('income-amount').value);
        if (source && amount) {
            addListItem(incomeList, source, amount);
            totalIncome += amount;
            updateSummary();
            incomeForm.reset();
        }
    });

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('expense-category').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        if (category && amount) {
            addListItem(expenseList, category, amount);
            totalExpenses += amount;
            updateSummary();
            expenseForm.reset();
        }
    });

    function addListItem(list, name, amount) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}</span><span>R${amount.toFixed(2)}</span>`;
        list.appendChild(li);
    }

    function updateSummary() {
        totalIncomeEl.textContent = `R${totalIncome.toFixed(2)}`;
        totalExpensesEl.textContent = `R${totalExpenses.toFixed(2)}`;
        const remainingBalance = totalIncome - totalExpenses;
        remainingBalanceEl.textContent = `R${remainingBalance.toFixed(2)}`;
    }
});
