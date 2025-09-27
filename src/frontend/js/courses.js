
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('courses-search');
    const categoryFilters = document.querySelectorAll('.course-filter-cat .filter-item');
    const levelFilters = document.querySelectorAll('.course-filter-level .filter-item');
    const courseCards = document.querySelectorAll('.course-card');

    function filterCourses() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.course-filter-cat .filter-item.active').dataset.filter;
        const activeLevel = document.querySelector('.course-filter-level .filter-item.active').dataset.filter;

        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.dataset.category;
            const level = card.dataset.level;

            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            const matchesLevel = activeLevel === 'all' || level === activeLevel;

            if (matchesSearch && matchesCategory && matchesLevel) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterCourses);

    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            filterCourses();
        });
    });

    levelFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            levelFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            filterCourses();
        });
    });
});
