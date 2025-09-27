// budgeting.js - Budgeting page functionality

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const budgetForm = document.getElementById('budgetForm');
const expensesList = document.getElementById('expensesList');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const newBudgetBtn = document.getElementById('newBudgetBtn');
const toggleInsights = document.getElementById('toggleInsights');
const communityInsights = document.getElementById('communityInsights');
const aiRecommendations = document.getElementById('aiRecommendations');

// Budget data
let budgetData = {
    income: 0,
    expenses: [],
    savingsGoal: 0
};

// Chart instance
let budgetChart = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeBudgetForm();
    loadSampleData();
    updateBudgetSummary();
});

// Navigation functionality
function initializeNavigation() {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Budget form functionality
function initializeBudgetForm() {
    // Add expense button
    addExpenseBtn.addEventListener('click', addExpenseField);
    
    // Form submission
    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processBudgetData();
    });
    
    // New budget button
    newBudgetBtn.addEventListener('click', resetBudgetForm);
    
    // Toggle community insights
    toggleInsights.addEventListener('click', function() {
        communityInsights.classList.toggle('d-none');
        const icon = toggleInsights.querySelector('i');
        
        if (communityInsights.classList.contains('d-none')) {
            toggleInsights.innerHTML = '<i class="fas fa-users"></i> Community Insights';
        } else {
            toggleInsights.innerHTML = '<i class="fas fa-times"></i> Hide Insights';
            updateCommunityInsights();
        }
    });
    
    // Income input change
    document.getElementById('income').addEventListener('input', function() {
        updateSavingsSuggestion();
    });
}

// Add a new expense field
function addExpenseField(category = '', amount = '') {
    const expenseId = Date.now();
    const expenseItem = document.createElement('div');
    expenseItem.className = 'expense-item';
    expenseItem.innerHTML = `
        <input type="text" class="form-control expense-category" placeholder="Expense category" value="${category}">
        <input type="number" class="form-control expense-amount" placeholder="Amount" min="0" step="0.01" value="${amount}">
        <div class="expense-actions">
            <button type="button" class="delete-expense" data-id="${expenseId}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    expensesList.appendChild(expenseItem);
    
    // Add event listener to delete button
    const deleteBtn = expenseItem.querySelector('.delete-expense');
    deleteBtn.addEventListener('click', function() {
        expensesList.removeChild(expenseItem);
        updateBudgetSummary();
    });
    
    // Add event listeners to inputs
    const categoryInput = expenseItem.querySelector('.expense-category');
    const amountInput = expenseItem.querySelector('.expense-amount');
    
    categoryInput.addEventListener('input', updateBudgetSummary);
    amountInput.addEventListener('input', updateBudgetSummary);
}

// Process budget data from form
function processBudgetData() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 0;
    
    // Get expenses from form
    const expenseItems = expensesList.querySelectorAll('.expense-item');
    const expenses = [];
    
    expenseItems.forEach(item => {
        const category = item.querySelector('.expense-category').value.trim();
        const amount = parseFloat(item.querySelector('.expense-amount').value) || 0;
        
        if (category && amount > 0) {
            expenses.push({ category, amount });
        }
    });
    
    // Update budget data
    budgetData = {
        income,
        expenses,
        savingsGoal
    };
    
    updateBudgetSummary();
    generateAIRecommendations();
    
    // Show success message
    showNotification('Budget updated successfully!', 'success');
}

// Update budget summary display
function updateBudgetSummary() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 0;
    
    // Calculate total expenses
    let totalExpenses = 0;
    const expenseItems = expensesList.querySelectorAll('.expense-item');
    const expensesByCategory = {};
    
    expenseItems.forEach(item => {
        const category = item.querySelector('.expense-category').value.trim() || 'Uncategorized';
        const amount = parseFloat(item.querySelector('.expense-amount').value) || 0;
        
        if (amount > 0) {
            totalExpenses += amount;
            
            if (expensesByCategory[category]) {
                expensesByCategory[category] += amount;
            } else {
                expensesByCategory[category] = amount;
            }
        }
    });
    
    const remaining = income - totalExpenses;
    const savingsRate = income > 0 ? ((remaining / income) * 100).toFixed(1) : 0;
    
    // Update summary elements
    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('remainingAmount').textContent = formatCurrency(remaining);
    document.getElementById('savingsRate').textContent = `${savingsRate}%`;
    
    // Update chart
    updateBudgetChart(income, expensesByCategory, remaining);
    
    // Update community insights if visible
    if (!communityInsights.classList.contains('d-none')) {
        updateCommunityInsights();
    }
}

// Update the budget chart
function updateBudgetChart(income, expensesByCategory, remaining) {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (budgetChart) {
        budgetChart.destroy();
    }
    
    // Prepare data for chart
    const categories = Object.keys(expensesByCategory);
    const amounts = Object.values(expensesByCategory);
    
    // Add savings/remaining as a category
    if (remaining > 0) {
        categories.push('Savings/Remaining');
        amounts.push(remaining);
    }
    
    // Create chart
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = ((value / income) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Generate AI recommendations based on budget data
function generateAIRecommendations() {
    const income = budgetData.income;
    const expenses = budgetData.expenses;
    const savingsGoal = budgetData.savingsGoal;
    
    // Clear previous recommendations
    aiRecommendations.innerHTML = '';
    
    if (income === 0) {
        return;
    }
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = income - totalExpenses;
    const currentSavingsRate = (remaining / income) * 100;
    
    // Calculate expense percentages
    const expensePercentages = {};
    expenses.forEach(expense => {
        expensePercentages[expense.category] = (expense.amount / income) * 100;
    });
    
    // Generate recommendations based on financial best practices
    const recommendations = [];
    
    // Savings recommendation
    if (currentSavingsRate < 15) {
        const targetSavings = income * 0.15;
        const additionalSavings = targetSavings - remaining;
        
        if (additionalSavings > 0) {
            recommendations.push({
                icon: 'fas fa-piggy-bank',
                title: 'Increase Your Savings',
                description: `Aim to save at least 15% of your income. You could save an additional ${formatCurrency(additionalSavings)} per month by adjusting your expenses.`
            });
        }
    } else if (currentSavingsRate >= 15) {
        recommendations.push({
            icon: 'fas fa-award',
            title: 'Great Savings Rate!',
            description: `You're saving ${currentSavingsRate.toFixed(1)}% of your income, which exceeds the recommended 15%. Consider investing your surplus.`
        });
    }
    
    // Housing expense recommendation (should be < 30% of income)
    const housingExpense = expenses.find(e => 
        e.category.toLowerCase().includes('rent') || 
        e.category.toLowerCase().includes('mortgage') ||
        e.category.toLowerCase().includes('housing')
    );
    
    if (housingExpense && (housingExpense.amount / income) > 0.3) {
        recommendations.push({
            icon: 'fas fa-home',
            title: 'High Housing Costs',
            description: `Your housing costs are ${((housingExpense.amount / income) * 100).toFixed(1)}% of your income. Consider ways to reduce this to under 30%.`
        });
    }
    
    // Food expense recommendation (should be < 15% of income)
    const foodExpense = expenses.find(e => 
        e.category.toLowerCase().includes('food') || 
        e.category.toLowerCase().includes('groceries') ||
        e.category.toLowerCase().includes('dining')
    );
    
    if (foodExpense && (foodExpense.amount / income) > 0.15) {
        recommendations.push({
            icon: 'fas fa-utensils',
            title: 'Optimize Food Spending',
            description: `You're spending ${((foodExpense.amount / income) * 100).toFixed(1)}% of your income on food. Meal planning could help reduce this expense.`
        });
    }
    
    // Debt repayment recommendation
    const debtExpense = expenses.find(e => 
        e.category.toLowerCase().includes('loan') || 
        e.category.toLowerCase().includes('debt') ||
        e.category.toLowerCase().includes('credit')
    );
    
    if (debtExpense && debtExpense.amount > 0) {
        const debtRatio = (debtExpense.amount / income) * 100;
        
        if (debtRatio > 20) {
            recommendations.push({
                icon: 'fas fa-credit-card',
                title: 'High Debt Payments',
                description: `Your debt payments are ${debtRatio.toFixed(1)}% of your income. Consider debt consolidation or repayment strategies.`
            });
        }
    }
    
    // Display recommendations
    if (recommendations.length === 0) {
        const noRecMessage = document.createElement('div');
        noRecMessage.className = 'recommendation-item';
        noRecMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div class="recommendation-content">
                <h4>Well Balanced Budget</h4>
                <p>Your budget follows financial best practices. Keep up the good work!</p>
            </div>
        `;
        aiRecommendations.appendChild(noRecMessage);
    } else {
        recommendations.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation-item';
            recElement.innerHTML = `
                <i class="${rec.icon}"></i>
                <div class="recommendation-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            `;
            aiRecommendations.appendChild(recElement);
        });
    }
}

// Update community insights comparison
function updateCommunityInsights() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    
    if (income === 0) return;
    
    // Calculate user percentages
    const housingExpense = getExpenseByCategory(['rent', 'mortgage', 'housing']);
    const foodExpense = getExpenseByCategory(['food', 'groceries', 'dining']);
    
    const userHousingPct = housingExpense > 0 ? ((housingExpense / income) * 100).toFixed(1) : 0;
    const userFoodPct = foodExpense > 0 ? ((foodExpense / income) * 100).toFixed(1) : 0;
    
    const totalExpenses = Array.from(expensesList.querySelectorAll('.expense-item'))
        .reduce((sum, item) => {
            const amount = parseFloat(item.querySelector('.expense-amount').value) || 0;
            return sum + amount;
        }, 0);
    
    const userSavingsPct = income > 0 ? (((income - totalExpenses) / income) * 100).toFixed(1) : 0;
    
    // Community averages (simulated data)
    const communityHousingPct = 28;
    const communityFoodPct = 12;
    const communitySavingsPct = 15;
    
    // Update display values
    document.getElementById('userHousing').textContent = `${userHousingPct}% of income`;
    document.getElementById('userFood').textContent = `${userFoodPct}% of income`;
    document.getElementById('userSavings').textContent = `${userSavingsPct}% of income`;
    
    document.getElementById('communityHousing').textContent = `${communityHousingPct}%`;
    document.getElementById('communityFood').textContent = `${communityFoodPct}%`;
    document.getElementById('communitySavings').textContent = `${communitySavingsPct}%`;
    
    // Update comparison bars
    document.getElementById('userHousingBar').style.width = `${Math.min(userHousingPct, 100)}%`;
    document.getElementById('communityHousingBar').style.width = `${communityHousingPct}%`;
    
    document.getElementById('userFoodBar').style.width = `${Math.min(userFoodPct, 100)}%`;
    document.getElementById('communityFoodBar').style.width = `${communityFoodPct}%`;
    
    document.getElementById('userSavingsBar').style.width = `${Math.min(userSavingsPct, 100)}%`;
    document.getElementById('communitySavingsBar').style.width = `${communitySavingsPct}%`;
    
    // Calculate potential savings
    const potentialHousingSavings = housingExpense > (income * communityHousingPct / 100) ? 
        housingExpense - (income * communityHousingPct / 100) : 0;
    
    const potentialFoodSavings = foodExpense > (income * communityFoodPct / 100) ? 
        foodExpense - (income * communityFoodPct / 100) : 0;
    
    const potentialSavings = potentialHousingSavings + potentialFoodSavings;
    
    document.getElementById('potentialSavings').textContent = formatCurrency(potentialSavings);
}

// Helper function to get expense amount by category keywords
function getExpenseByCategory(keywords) {
    let total = 0;
    
    expensesList.querySelectorAll('.expense-item').forEach(item => {
        const category = item.querySelector('.expense-category').value.toLowerCase();
        const amount = parseFloat(item.querySelector('.expense-amount').value) || 0;
        
        if (keywords.some(keyword => category.includes(keyword))) {
            total += amount;
        }
    });
    
    return total;
}

// Update savings goal suggestion based on income
function updateSavingsSuggestion() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const savingsGoalInput = document.getElementById('savingsGoal');
    
    if (income > 0 && (!savingsGoalInput.value || savingsGoalInput.value === '0')) {
        // Suggest 15% of income as savings goal
        const suggestedSavings = income * 0.15;
        savingsGoalInput.placeholder = `Suggested: ${formatCurrency(suggestedSavings)}`;
    }
}

// Reset budget form
function resetBudgetForm() {
    budgetForm.reset();
    expensesList.innerHTML = '';
    budgetData = { income: 0, expenses: [], savingsGoal: 0 };
    
    if (budgetChart) {
        budgetChart.destroy();
        budgetChart = null;
    }
    
    aiRecommendations.innerHTML = '';
    updateBudgetSummary();
    
    showNotification('Budget form reset. Ready to create a new budget!', 'info');
}

// Load sample data for demonstration
function loadSampleData() {
    // Set sample income
    document.getElementById('income').value = 3500;
    
    // Add sample expenses
    addExpenseField('Rent', 1200);
    addExpenseField('Groceries', 400);
    addExpenseField('Utilities', 150);
    addExpenseField('Transportation', 200);
    addExpenseField('Entertainment', 150);
    
    // Set sample savings goal
    document.getElementById('savingsGoal').value = 500;
    
    // Process the sample data
    setTimeout(() => {
        processBudgetData();
    }, 500);
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);