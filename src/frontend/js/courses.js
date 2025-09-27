// courses.js - Learning and courses page functionality

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const coursesContainer = document.getElementById('coursesContainer');
const courseModal = document.getElementById('courseModal');
const lessonModal = document.getElementById('lessonModal');
const modalClose = document.getElementById('modalClose');
const lessonModalClose = document.getElementById('lessonModalClose');
const filterBtns = document.querySelectorAll('.filter-btn');
const startRecommendedBtn = document.getElementById('startRecommendedBtn');
const aiRecommendationText = document.getElementById('aiRecommendationText');

// Learning State
let userProgress = {
    completedModules: 0,
    totalPoints: 0,
    learningStreak: 0,
    overallProgress: 0,
    completedCourses: [],
    currentCourse: null,
    currentLesson: 0
};

// Course Data
const courses = [
    {
        id: 1,
        title: "Budgeting Basics",
        description: "Learn how to create and maintain a personal budget to achieve your financial goals.",
        level: "beginner",
        category: "budgeting",
        duration: "2 hours",
        lessons: 5,
        image: "fas fa-chart-pie",
        progress: 0,
        lessons: [
            {
                title: "Introduction to Budgeting",
                duration: "15 min",
                content: "Budgeting is the process of creating a plan to spend your money. This spending plan is called a budget. Creating this spending plan allows you to determine in advance whether you will have enough money to do the things you need to do or would like to do.",
                interactive: {
                    type: "quiz",
                    question: "What is the primary purpose of budgeting?",
                    options: [
                        "To restrict your spending completely",
                        "To plan how you will spend your money",
                        "To track every penny you spend",
                        "To impress your friends with financial knowledge"
                    ],
                    correct: 1
                }
            },
            {
                title: "Income vs Expenses",
                duration: "20 min",
                content: "Understanding the difference between your income (money coming in) and expenses (money going out) is crucial for effective budgeting.",
                interactive: {
                    type: "drag-drop",
                    question: "Categorize these items as income or expenses:",
                    items: [
                        { text: "Salary", type: "income" },
                        { text: "Rent", type: "expense" },
                        { text: "Groceries", type: "expense" },
                        { text: "Freelance payment", type: "income" }
                    ]
                }
            },
            {
                title: "Creating Your First Budget",
                duration: "25 min",
                content: "Now that you understand the basics, let's create your first budget using the 50/30/20 rule.",
                interactive: {
                    type: "calculator",
                    question: "If your monthly income is $3000, how much should go to needs, wants, and savings?",
                    formula: {
                        needs: "income * 0.5",
                        wants: "income * 0.3",
                        savings: "income * 0.2"
                    }
                }
            }
        ]
    },
    {
        id: 2,
        title: "Cybersecurity Fundamentals",
        description: "Protect your financial information from online threats with essential security practices.",
        level: "beginner",
        category: "security",
        duration: "3 hours",
        lessons: 6,
        image: "fas fa-shield-alt",
        progress: 0,
        lessons: [
            {
                title: "Understanding Online Threats",
                duration: "20 min",
                content: "Learn about common online threats like phishing, malware, and identity theft that can compromise your financial security.",
                interactive: {
                    type: "identification",
                    question: "Identify which of these emails might be a phishing attempt:",
                    examples: [
                        { text: "Urgent: Your account will be suspended unless you verify your details now!", suspicious: true },
                        { text: "Monthly statement from your bank is available", suspicious: false },
                        { text: "You've won a prize! Click here to claim", suspicious: true }
                    ]
                }
            },
            {
                title: "Creating Strong Passwords",
                duration: "15 min",
                content: "Learn how to create and manage strong, unique passwords for all your financial accounts.",
                interactive: {
                    type: "password-checker",
                    question: "Check the strength of these passwords:",
                    passwords: [
                        "password123",
                        "P@ssw0rd!",
                        "MyDog'sName2023",
                        "Tr0ub4dour&3"
                    ]
                }
            }
        ]
    },
    {
        id: 3,
        title: "Investment Principles",
        description: "Understand the fundamentals of investing and how to grow your wealth over time.",
        level: "intermediate",
        category: "investing",
        duration: "4 hours",
        lessons: 7,
        image: "fas fa-chart-line",
        progress: 0,
        lessons: [
            {
                title: "Risk vs Reward",
                duration: "25 min",
                content: "All investments carry some degree of risk. Understanding the relationship between risk and potential reward is key to successful investing.",
                interactive: {
                    type: "matching",
                    question: "Match the investment type with its typical risk level:",
                    pairs: [
                        { investment: "Savings Account", risk: "Low" },
                        { investment: "Stock Market", risk: "High" },
                        { investment: "Bonds", risk: "Medium" },
                        { investment: "Cryptocurrency", risk: "Very High" }
                    ]
                }
            }
        ]
    },
    {
        id: 4,
        title: "Advanced Financial Planning",
        description: "Take your financial knowledge to the next level with advanced planning strategies.",
        level: "advanced",
        category: "planning",
        duration: "5 hours",
        lessons: 8,
        image: "fas fa-chess",
        progress: 0
    },
    {
        id: 5,
        title: "Scam Detection Mastery",
        description: "Become an expert at identifying and avoiding financial scams and fraud.",
        level: "intermediate",
        category: "security",
        duration: "3.5 hours",
        lessons: 6,
        image: "fas fa-user-secret",
        progress: 0
    },
    {
        id: 6,
        title: "Credit Score Optimization",
        description: "Learn how to build, maintain, and improve your credit score for better financial opportunities.",
        level: "intermediate",
        category: "credit",
        duration: "2.5 hours",
        lessons: 5,
        image: "fas fa-credit-card",
        progress: 0
    }
];

// Badges Data
const badges = [
    { id: 1, name: "First Steps", icon: "fas fa-seedling", description: "Complete your first lesson" },
    { id: 2, name: "Budget Master", icon: "fas fa-coins", description: "Complete the Budgeting Basics course" },
    { id: 3, name: "Security Guardian", icon: "fas fa-shield-alt", description: "Complete the Cybersecurity Fundamentals course" },
    { id: 4, name: "Investment Guru", icon: "fas fa-chart-line", description: "Complete the Investment Principles course" },
    { id: 5, name: "Quick Learner", icon: "fas fa-bolt", description: "Complete 5 lessons in one day" },
    { id: 6, name: "Knowledge Seeker", icon: "fas fa-graduation-cap", description: "Complete 3 courses" },
    { id: 7, name: "Quiz Champion", icon: "fas fa-trophy", description: "Score 100% on 5 quizzes" },
    { id: 8, name: "Community Helper", icon: "fas fa-hands-helping", description: "Help 3 other learners in the community" }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadCourses();
    updateProgressDisplay();
    generateQuiz();
    loadBadges();
});

// Initialize page state
function initializePage() {
    // Load user progress from localStorage or set defaults
    const savedProgress = localStorage.getItem('finEdLearningProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    } else {
        // Set initial values
        userProgress.completedModules = 0;
        userProgress.totalPoints = 0;
        userProgress.learningStreak = 1; // Start with a 1-day streak
        userProgress.overallProgress = 0;
        userProgress.completedCourses = [];
        userProgress.currentCourse = null;
        userProgress.currentLesson = 0;
        
        // Save to localStorage
        localStorage.setItem('finEdLearningProgress', JSON.stringify(userProgress));
    }
    
    // Update AI recommendation
    updateAIRecommendation();
}

// Set up event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Course filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter courses
            const category = this.getAttribute('data-category');
            filterCourses(category);
        });
    });
    
    // Modal close buttons
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            courseModal.close();
        });
    }
    
    if (lessonModalClose) {
        lessonModalClose.addEventListener('click', function() {
            lessonModal.close();
        });
    }
    
    // Start recommended course button
    if (startRecommendedBtn) {
        startRecommendedBtn.addEventListener('click', function() {
            startRecommendedCourse();
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === courseModal) {
            courseModal.close();
        }
        if (event.target === lessonModal) {
            lessonModal.close();
        }
    });
}

// Load and display courses
function loadCourses() {
    coursesContainer.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesContainer.appendChild(courseCard);
    });
}

// Create a course card element
function createCourseCard(course) {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.setAttribute('data-course-id', course.id);
    card.setAttribute('data-category', course.category);
    card.setAttribute('data-level', course.level);
    
    // Check if course is completed
    const isCompleted = userProgress.completedCourses.includes(course.id);
    const progress = userProgress.completedCourses.includes(course.id) ? 100 : course.progress;
    
    card.innerHTML = `
        <div class="course-image">
            <i class="${course.image}"></i>
        </div>
        <div class="course-content">
            <div class="course-header">
                <h3 class="course-title">${course.title}</h3>
                <span class="course-level level-${course.level}">${course.level}</span>
            </div>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-book-open"></i> ${course.lessons} lessons</span>
            </div>
            ${progress > 0 ? `
                <div class="course-progress">
                    <div class="progress-text">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            ` : ''}
            <div class="course-actions">
                <button class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-primary'} start-course-btn">
                    ${isCompleted ? 'Review' : 'Start'} Course
                </button>
                <button class="btn btn-sm btn-outline view-details-btn">Details</button>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const startBtn = card.querySelector('.start-course-btn');
    const detailsBtn = card.querySelector('.view-details-btn');
    
    startBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        startCourse(course.id);
    });
    
    detailsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showCourseDetails(course.id);
    });
    
    card.addEventListener('click', function() {
        showCourseDetails(course.id);
    });
    
    return card;
}

// Filter courses by category
function filterCourses(category) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category || 
            card.getAttribute('data-level') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Show course details in modal
function showCourseDetails(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Update modal content
    document.getElementById('modalCourseTitle').textContent = course.title;
    document.getElementById('modalCourseLevel').textContent = course.level;
    document.getElementById('modalCourseLevel').className = `course-level level-${course.level}`;
    document.getElementById('modalCourseDescription').textContent = course.description;
    
    // Generate lesson list
    const lessonList = document.getElementById('lessonList');
    lessonList.innerHTML = '';
    
    if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach((lesson, index) => {
            const isCompleted = userProgress.completedCourses.includes(courseId) || 
                               (userProgress.currentCourse === courseId && userProgress.currentLesson > index);
            
            const lessonItem = document.createElement('div');
            lessonItem.className = `lesson-item ${isCompleted ? 'completed' : ''}`;
            lessonItem.innerHTML = `
                <i class="lesson-icon fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'}"></i>
                <div class="lesson-info">
                    <h4>${lesson.title}</h4>
                    <span class="lesson-duration">${lesson.duration}</span>
                </div>
            `;
            lessonList.appendChild(lessonItem);
        });
    } else {
        lessonList.innerHTML = '<p>Lesson details coming soon!</p>';
    }
    
    // Update modal buttons
    const startCourseBtn = document.getElementById('startCourseBtn');
    const addToLearningPathBtn = document.getElementById('addToLearningPathBtn');
    
    const isCompleted = userProgress.completedCourses.includes(courseId);
    
    startCourseBtn.textContent = isCompleted ? 'Review Course' : 'Start Course';
    startCourseBtn.onclick = function() {
        startCourse(courseId);
        courseModal.close();
    };
    
    addToLearningPathBtn.onclick = function() {
        addToLearningPath(courseId);
    };
    
    // Show the modal
    courseModal.showModal();
}

// Start a course
function startCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    userProgress.currentCourse = courseId;
    userProgress.currentLesson = 0;
    
    // Save progress
    localStorage.setItem('finEdLearningProgress', JSON.stringify(userProgress));
    
    // Show first lesson
    showLesson(courseId, 0);
}

// Show a lesson in the lesson modal
function showLesson(courseId, lessonIndex) {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.lessons || lessonIndex >= course.lessons.length) return;
    
    const lesson = course.lessons[lessonIndex];
    
    // Update modal content
    document.getElementById('lessonTitle').textContent = lesson.title;
    document.getElementById('lessonProgress').textContent = `${Math.round((lessonIndex / course.lessons.length) * 100)}%`;
    
    // Lesson content
    const lessonContent = document.getElementById('lessonContent');
    lessonContent.innerHTML = `<p>${lesson.content}</p>`;
    
    // Interactive section
    const interactiveSection = document.getElementById('lessonInteractive');
    interactiveSection.innerHTML = '';
    
    if (lesson.interactive) {
        const interactiveElement = createInteractiveElement(lesson.interactive);
        interactiveSection.appendChild(interactiveElement);
    }
    
    // Update navigation buttons
    const prevLessonBtn = document.getElementById('prevLessonBtn');
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    const completeLessonBtn = document.getElementById('completeLessonBtn');
    
    prevLessonBtn.disabled = lessonIndex === 0;
    prevLessonBtn.onclick = function() {
        showLesson(courseId, lessonIndex - 1);
    };
    
    if (lessonIndex === course.lessons.length - 1) {
        nextLessonBtn.style.display = 'none';
        completeLessonBtn.style.display = 'block';
        completeLessonBtn.onclick = function() {
            completeCourse(courseId);
        };
    } else {
        nextLessonBtn.style.display = 'block';
        completeLessonBtn.style.display = 'none';
        nextLessonBtn.onclick = function() {
            showLesson(courseId, lessonIndex + 1);
        };
    }
    
    // Show the modal
    lessonModal.showModal();
}

// Create interactive elements for lessons
function createInteractiveElement(interactiveData) {
    const container = document.createElement('div');
    container.className = 'interactive-element';
    
    switch (interactiveData.type) {
        case 'quiz':
            container.innerHTML = `
                <div class="interactive-question">
                    <h4>${interactiveData.question}</h4>
                </div>
                <div class="interactive-options">
                    ${interactiveData.options.map((option, index) => `
                        <div class="interactive-option" data-index="${index}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <div class="interactive-feedback" style="display: none;"></div>
            `;
            
            // Add event listeners to options
            const options = container.querySelectorAll('.interactive-option');
            options.forEach(option => {
                option.addEventListener('click', function() {
                    // Remove selected class from all options
                    options.forEach(opt => opt.classList.remove('selected'));
                    // Add selected class to clicked option
                    this.classList.add('selected');
                    
                    // Check if answer is correct
                    const selectedIndex = parseInt(this.getAttribute('data-index'));
                    const isCorrect = selectedIndex === interactiveData.correct;
                    
                    // Show feedback
                    const feedback = container.querySelector('.interactive-feedback');
                    feedback.textContent = isCorrect ? 
                        'Correct! Well done.' : 
                        'Not quite. Try again!';
                    feedback.style.display = 'block';
                    feedback.className = `interactive-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
                    
                    // If correct, award points
                    if (isCorrect) {
                        userProgress.totalPoints += 10;
                        localStorage.setItem('finEdLearningProgress', JSON.stringify(userProgress));
                        updateProgressDisplay();
                    }
                });
            });
            break;
            
        // Add cases for other interactive types (drag-drop, calculator, etc.)
        default:
            container.innerHTML = `<p>Interactive content coming soon!</p>`;
    }
    
    return container;
}

// Complete a course
function completeCourse(courseId) {
    if (!userProgress.completedCourses.includes(courseId)) {
        userProgress.completedCourses.push(courseId);
        userProgress.completedModules += courses.find(c => c.id === courseId).lessons;
        userProgress.totalPoints += 100; // Points for completing a course
        userProgress.learningStreak += 1;
        
        // Calculate overall progress
        userProgress.overallProgress = Math.round((userProgress.completedCourses.length / courses.length) * 100);
        
        // Save progress
        localStorage.setItem('finEdLearningProgress', JSON.stringify(userProgress));
        
        // Update display
        updateProgressDisplay();
        loadCourses(); // Refresh course cards to show completion
        
        // Show completion message
        alert('Congratulations! You have completed this course.');
    }
    
    // Close the lesson modal
    lessonModal.close();
}

// Add course to learning path
function addToLearningPath(courseId) {
    // In a real app, this would add to a personalized learning path
    alert('Course added to your learning path!');
}

// Update AI recommendation based on user progress
function updateAIRecommendation() {
    if (userProgress.completedCourses.length === 0) {
        aiRecommendationText.textContent = "Based on your profile, we recommend starting with Budgeting Basics to build a strong financial foundation.";
        startRecommendedBtn.textContent = "Start Budgeting Basics";
        startRecommendedBtn.onclick = function() {
            startCourse(1); // Budgeting Basics course ID
        };
    } else if (!userProgress.completedCourses.includes(2)) {
        aiRecommendationText.textContent = "Now that you understand budgeting, we recommend learning about Cybersecurity Fundamentals to protect your financial information.";
        startRecommendedBtn.textContent = "Start Cybersecurity Fundamentals";
        startRecommendedBtn.onclick = function() {
            startCourse(2); // Cybersecurity Fundamentals course ID
        };
    } else if (!userProgress.completedCourses.includes(3)) {
        aiRecommendationText.textContent = "With budgeting and security knowledge, you're ready to explore Investment Principles to grow your wealth.";
        startRecommendedBtn.textContent = "Start Investment Principles";
        startRecommendedBtn.onclick = function() {
            startCourse(3); // Investment Principles course ID
        };
    } else {
        aiRecommendationText.textContent = "You're making great progress! Consider exploring our advanced courses to continue your financial education.";
        startRecommendedBtn.textContent = "Browse All Courses";
        startRecommendedBtn.onclick = function() {
            // Scroll to courses section
            document.querySelector('.course-categories').scrollIntoView({ behavior: 'smooth' });
        };
    }
}

// Start the recommended course
function startRecommendedCourse() {
    if (userProgress.completedCourses.length === 0) {
        startCourse(1); // Budgeting Basics
    } else if (!userProgress.completedCourses.includes(2)) {
        startCourse(2); // Cybersecurity Fundamentals
    } else if (!userProgress.completedCourses.includes(3)) {
        startCourse(3); // Investment Principles
    } else {
        // Scroll to courses section
        document.querySelector('.course-categories').scrollIntoView({ behavior: 'smooth' });
    }
}

// Update progress display
function updateProgressDisplay() {
    document.getElementById('completedModules').textContent = userProgress.completedModules;
    document.getElementById('totalPoints').textContent = userProgress.totalPoints;
    document.getElementById('learningStreak').textContent = userProgress.learningStreak;
    document.getElementById('progressPercent').textContent = `${userProgress.overallProgress}%`;
    document.getElementById('progressFill').style.width = `${userProgress.overallProgress}%`;
}

// Generate a random quiz
function generateQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    const quizQuestions = [
        {
            question: "What is the first step in creating a budget?",
            options: [
                "Track all your expenses for a month",
                "Set financial goals",
                "Calculate your total income",
                "Cut all unnecessary spending"
            ],
            correct: 2,
            explanation: "The first step is to calculate your total income so you know how much money you have to work with."
        },
        {
            question: "Which of these is a characteristic of a strong password?",
            options: [
                "Uses common dictionary words",
                "Contains personal information like your birthdate",
                "Is at least 12 characters long with a mix of character types",
                "Is the same across all your accounts for consistency"
            ],
            correct: 2,
            explanation: "Strong passwords are long, complex, and unique for each account."
        },
        {
            question: "What does the '20' in the 50/30/20 budgeting rule represent?",
            options: [
                "20% of income for entertainment",
                "20% of income for savings and debt repayment",
                "20% of income for housing",
                "20% of income for investments"
            ],
            correct: 1,
            explanation: "The 50/30/20 rule allocates 50% to needs, 30% to wants, and 20% to savings and debt repayment."
        }
    ];
    
    const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    
    quizContainer.innerHTML = `
        <div class="quiz-header">
            <h3>Test Your Knowledge</h3>
            <p>Quick quiz to reinforce what you've learned</p>
        </div>
        <div class="quiz-question">${randomQuestion.question}</div>
        <div class="quiz-options">
            ${randomQuestion.options.map((option, index) => `
                <div class="quiz-option" data-index="${index}">
                    ${option}
                </div>
            `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
        <div class="quiz-navigation">
            <button class="btn btn-outline" id="skipQuizBtn">Skip Question</button>
            <button class="btn btn-primary" id="submitQuizBtn" disabled>Submit Answer</button>
        </div>
    `;
    
    // Add event listeners to quiz options
    const quizOptions = quizContainer.querySelectorAll('.quiz-option');
    const submitBtn = quizContainer.querySelector('#submitQuizBtn');
    const skipBtn = quizContainer.querySelector('#skipQuizBtn');
    const feedback = quizContainer.querySelector('#quizFeedback');
    
    let selectedOption = null;
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            quizOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            selectedOption = parseInt(this.getAttribute('data-index'));
            submitBtn.disabled = false;
        });
    });
    
    submitBtn.addEventListener('click', function() {
        if (selectedOption === null) return;
        
        const isCorrect = selectedOption === randomQuestion.correct;
        
        // Show feedback
        feedback.textContent = isCorrect ? 
            `Correct! ${randomQuestion.explanation}` : 
            `Incorrect. The correct answer is: ${randomQuestion.options[randomQuestion.correct]}. ${randomQuestion.explanation}`;
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Disable options and submit button
        quizOptions.forEach(option => {
            option.style.pointerEvents = 'none';
            if (parseInt(option.getAttribute('data-index')) === randomQuestion.correct) {
                option.classList.add('correct');
            }
        });
        
        submitBtn.disabled = true;
        
        // Award points for correct answer
        if (isCorrect) {
            userProgress.totalPoints += 5;
            localStorage.setItem('finEdLearningProgress', JSON.stringify(userProgress));
            updateProgressDisplay();
        }
    });
    
    skipBtn.addEventListener('click', function() {
        generateQuiz(); // Generate a new quiz
    });
}

// Load and display badges
function loadBadges() {
    const badgesContainer = document.getElementById('badgesContainer');
    if (!badgesContainer) return;
    
    badgesContainer.innerHTML = '';
    
    badges.forEach(badge => {
        const isEarned = checkIfBadgeEarned(badge.id);
        
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge-item ${isEarned ? 'earned' : ''}`;
        badgeElement.innerHTML = `
            <div class="badge-icon">
                <i class="${badge.icon}"></i>
            </div>
            <div class="badge-name">${badge.name}</div>
        `;
        
        // Add tooltip for badge description
        badgeElement.title = badge.description;
        
        badgesContainer.appendChild(badgeElement);
    });
}

// Check if a badge has been earned
function checkIfBadgeEarned(badgeId) {
    switch (badgeId) {
        case 1: // First Steps
            return userProgress.completedModules > 0;
        case 2: // Budget Master
            return userProgress.completedCourses.includes(1);
        case 3: // Security Guardian
            return userProgress.completedCourses.includes(2);
        case 4: // Investment Guru
            return userProgress.completedCourses.includes(3);
        case 5: // Quick Learner
            // This would require tracking daily progress in a real app
            return userProgress.completedModules >= 5;
        case 6: // Knowledge Seeker
            return userProgress.completedCourses.length >= 3;
        case 7: // Quiz Champion
            // This would require tracking quiz performance in a real app
            return userProgress.totalPoints >= 50;
        case 8: // Community Helper
            // This would require community interaction tracking
            return false;
        default:
            return false;
    }
}