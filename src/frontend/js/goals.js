
document.addEventListener('DOMContentLoaded', () => {
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalModal = document.getElementById('goal-modal');
    const closeModal = document.querySelector('.goal-modal-close');
    const addGoalForm = document.getElementById('add-goal-form');
    const goalsGrid = document.querySelector('.goals-grid');

    // --- Toggle Add Goal Modal ---
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => {
            goalModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            goalModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === goalModal) {
            goalModal.style.display = 'none';
        }
    });

    // --- Handle Form Submission ---
    if (addGoalForm) {
        addGoalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goalName = document.getElementById('goal-name').value;
            const goalTarget = document.getElementById('goal-target-amount').value;
            const goalCurrent = document.getElementById('goal-current-amount').value;
            const goalDeadline = document.getElementById('goal-deadline').value;

            if (goalName && goalTarget && goalCurrent && goalDeadline) {
                addGoalCard({ 
                    name: goalName, 
                    target: parseFloat(goalTarget), 
                    current: parseFloat(goalCurrent), 
                    deadline: goalDeadline 
                });
                goalModal.style.display = 'none';
                addGoalForm.reset();
            } else {
                alert('Please fill out all fields.');
            }
        });
    }

    // --- Add New Goal Card to UI ---
    function addGoalCard(goal) {
        const { name, target, current, deadline } = goal;
        const progress = (current / target) * 100;

        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';

        goalCard.innerHTML = `
            <div class="goal-card-inner">
                <div class="goal-card-header">
                    <h3>${name}</h3>
                    <div class="goal-card-menu">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                <p class="goal-deadline">Deadline: ${new Date(deadline).toLocaleDateString()}</p>
                <div class="goal-progress-container">
                    <div class="goal-progress-bar" style="width: ${progress}%;"></div>
                </div>
                <div class="goal-amounts">
                    <span class="current-amount">R${current.toLocaleString()}</span>
                    <span class="target-amount">R${target.toLocaleString()}</span>
                </div>
                <button class="btn btn-secondary btn-sm btn-update-progress">Update Progress</button>
            </div>
        `;

        goalsGrid.appendChild(goalCard);
    }

    // --- Initial Dummy Goals ---
    const initialGoals = [
        {
            name: 'Emergency Fund',
            target: 50000,
            current: 35000,
            deadline: '2024-12-31'
        },
        {
            name: 'Dream Vacation to Japan',
            target: 80000,
            current: 25000,
            deadline: '2025-06-30'
        },
        {
            name: 'New Car Deposit',
            target: 100000,
            current: 70000,
            deadline: '2024-11-30'
        }
    ];

    initialGoals.forEach(addGoalCard);
});
