
document.addEventListener('DOMContentLoaded', () => {

    // --- Profile Completion Donut Chart ---
    const profileCompletionCtx = document.getElementById('profile-completion-chart')?.getContext('2d');
    if (profileCompletionCtx) {
        new Chart(profileCompletionCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [80, 20], // Example: 80% complete
                    backgroundColor: ['#3b82f6', '#334155'],
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

    // --- Form Editing Toggle ---
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const profileForm = document.getElementById('user-profile-form');

    if (editProfileBtn && saveProfileBtn && profileForm) {
        const formInputs = profileForm.querySelectorAll('input, select');

        editProfileBtn.addEventListener('click', () => {
            formInputs.forEach(input => input.disabled = false);
            saveProfileBtn.style.display = 'inline-block';
            editProfileBtn.style.display = 'none';
            showToast('Edit mode enabled.', 'info');
        });

        saveProfileBtn.addEventListener('click', () => {
            // Here you would typically handle form submission (e.g., via fetch)
            formInputs.forEach(input => input.disabled = true);
            saveProfileBtn.style.display = 'none';
            editProfileBtn.style.display = 'inline-block';
            showToast('Profile saved successfully!', 'success');
        });
    }

    // --- Profile Picture Upload ---
    const profilePicUpload = document.getElementById('profile-pic-upload');
    const profilePic = document.getElementById('profile-pic');

    if (profilePicUpload && profilePic) {
        profilePicUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profilePic.src = event.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // --- Simple Toast Notification Function ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
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
