
document.addEventListener('DOMContentLoaded', () => {
    // New discussion form submission
    const newDiscussionForm = document.getElementById('new-discussion-form');
    if (newDiscussionForm) {
        newDiscussionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('discussion-title').value;
            const content = document.getElementById('discussion-content').value;
            if (title && content) {
                console.log('New Discussion:', { title, content });
                alert('Your discussion has been posted!');
                newDiscussionForm.reset();
                // In a real app, you would dynamically add the new post to the list.
            }
        });
    }

    // Handle sorting
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            console.log('Sorting posts by:', e.target.value);
            // Add logic to re-order posts here
        });
    }

    // Handle category filtering
    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.textContent.trim();
            console.log('Filtering by category:', category);
            // Add filtering logic here
            categoryLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Handle tag filtering
    const tagLinks = document.querySelectorAll('.tags-list a');
    tagLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tag = e.target.textContent.trim();
            console.log('Filtering by tag:', tag);
            // Add filtering logic here
        });
    });
});
