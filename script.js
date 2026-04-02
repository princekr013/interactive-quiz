// Quiz Data
        const questions = [
            {
                question: "You added script.js correctly, but document.getElementById('btn') returns null. Most likely reason is:",
                options: [
                    "CSS file is missing",
                    "Button id is incorrect OR script loads before button exists",
                    "HTML cannot use ids",
                    "JavaScript does not support DOM"
                ],
                correctAnswer: 1
            },
            {
                question: "Which JavaScript method selects the element with id 'contact'?",
                options: [
                    "document.getElementById('contact')",
                    "document.getElementsByClassName('contact')",
                    "document.querySelectorAll('#contact')",
                    "document.getElementByName('contact')"
                ],
                correctAnswer: 0
            },
            {
                question: "Which HTML tag is used to insert an image?",
                options: [
                    "<picture>",
                    "<img>",
                    "<image>",
                    "<src>"
                ],
                correctAnswer: 1
            },
            {
                question: "Which property is commonly toggled to hide/show an element?",
                options: [
                    "element.textContent",
                    "element.style.display",
                    "element.value",
                    "element.innerHTML = null"
                ],
                correctAnswer: 1
            }
        ];

        // State
        let currentQuestionIndex = 0;
        let score = 0;
        let selectedOptionIndex = null;
        let hasAnswered = false;

        // DOM Elements
        const introContainer = document.getElementById('intro-container');
        const quizContainer = document.getElementById('quiz-container');
        const resultContainer = document.getElementById('result-container');

        const startBtn = document.getElementById('start-btn');
        const nextBtn = document.getElementById('next-btn');
        const restartBtn = document.getElementById('restart-btn');

        const questionText = document.getElementById('question-text');
        const optionsStack = document.getElementById('options-stack');
        const questionProgress = document.getElementById('question-progress');
        const scoreDisplay = document.getElementById('score-display');
        const progressBar = document.getElementById('progress-bar');
        const finalScore = document.getElementById('final-score');
        const resultMessage = document.getElementById('result-message');
        const resultIcon = document.getElementById('result-icon');
        const resultIconContainer = document.getElementById('result-icon-container');
        const resultPercentage = document.getElementById('result-percentage');

        // Initialize
        function init() {
            createParticles();
            startBtn.addEventListener('click', startQuiz);
            nextBtn.addEventListener('click', handleNext);
            restartBtn.addEventListener('click', restartQuiz);
        }

        // Create background particles
        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                container.appendChild(particle);
            }
        }

        // Start Quiz
        function startQuiz() {
            introContainer.classList.add('hidden');
            quizContainer.classList.remove('hidden');
            resultContainer.classList.add('hidden');

            currentQuestionIndex = 0;
            score = 0;
            updateScoreDisplay();
            loadQuestion();
        }

        // Load Question
        function loadQuestion() {
            selectedOptionIndex = null;
            hasAnswered = false;

            const currentQ = questions[currentQuestionIndex];

            // Update progress
            const progressPercent = (currentQuestionIndex / questions.length) * 100;
            progressBar.style.width = progressPercent + '%';
            questionProgress.textContent = `Question ${String(currentQuestionIndex + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;

            // Update question
            questionText.textContent = currentQ.question;

            // Clear and create options
            optionsStack.innerHTML = '';
            currentQ.options.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn w-full flex items-center gap-4 p-4 rounded-xl text-left cursor-pointer';
                btn.innerHTML = `
                    <div class="option-indicator">
                        <span class="material-symbols-rounded text-sm text-white hidden check-icon">check</span>
                    </div>
                    <span class="flex-1 font-medium text-slate-200">${opt}</span>
                `;
                btn.onclick = () => selectOption(index, btn);
                optionsStack.appendChild(btn);
            });

            // Reset next button
            nextBtn.disabled = true;
            nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
            nextBtn.classList.remove('hover:bg-primary-container');

            // Update button text
            if (currentQuestionIndex === questions.length - 1) {
                nextBtn.querySelector('span').textContent = 'Finish Quiz';
            } else {
                nextBtn.querySelector('span').textContent = 'Next Question';
            }

            // Add fade animation
            quizContainer.classList.remove('fade-in');
            void quizContainer.offsetWidth;
            quizContainer.classList.add('fade-in');
        }

        // Select Option
        function selectOption(index, selectedBtn) {
            if (hasAnswered) return;

            selectedOptionIndex = index;
            hasAnswered = true;

            const currentQ = questions[currentQuestionIndex];
            const isCorrect = index === currentQ.correctAnswer;

            // Update all options
            const allOptions = optionsStack.querySelectorAll('.option-btn');
            allOptions.forEach((btn, i) => {
                const indicator = btn.querySelector('.option-indicator');
                const checkIcon = btn.querySelector('.check-icon');

                if (i === index) {
                    btn.classList.add('selected');
                    if (isCorrect) {
                        btn.classList.add('correct');
                        indicator.innerHTML = '<span class="material-symbols-rounded text-sm text-white">check</span>';
                        score += 100;
                    } else {
                        btn.classList.add('incorrect');
                        indicator.innerHTML = '<span class="material-symbols-rounded text-sm text-white">close</span>';
                    }
                } else if (i === currentQ.correctAnswer) {
                    // Show correct answer if wrong selected
                    btn.classList.add('correct');
                    indicator.innerHTML = '<span class="material-symbols-rounded text-sm text-white">check</span>';
                }

                // Disable all buttons
                btn.style.cursor = 'default';
            });

            // Update score display
            updateScoreDisplay();

            // Enable next button
            nextBtn.disabled = false;
            nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        // Handle Next
        function handleNext() {
            if (selectedOptionIndex === null) return;

            currentQuestionIndex++;

            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }

        // Update Score Display
        function updateScoreDisplay() {
            scoreDisplay.textContent = `${score} pts`;
        }

        // Show Results
        function showResults() {
            quizContainer.classList.add('hidden');
            resultContainer.classList.remove('hidden');

            const maxScore = questions.length * 100;
            const percentage = (score / maxScore) * 100;

            finalScore.textContent = `${score} / ${maxScore}`;
            resultPercentage.textContent = `${Math.round(percentage)}% Accuracy`;

            // Set result based on score
            if (percentage === 100) {
                resultMessage.textContent = "Perfect Score!";
                resultIcon.textContent = "workspace_premium";
                resultIconContainer.className = "result-icon w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl bg-gradient-to-br from-yellow-400 to-orange-500";
                createConfetti();
            } else if (percentage >= 75) {
                resultMessage.textContent = "Excellent Work!";
                resultIcon.textContent = "stars";
                resultIconContainer.className = "result-icon w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600";
            } else if (percentage >= 50) {
                resultMessage.textContent = "Good Job!";
                resultIcon.textContent = "thumb_up";
                resultIconContainer.className = "result-icon w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl bg-gradient-to-br from-blue-500 to-cyan-500";
            } else {
                resultMessage.textContent = "Keep Practicing!";
                resultIcon.textContent = "school";
                resultIconContainer.className = "result-icon w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl bg-gradient-to-br from-slate-500 to-slate-600";
            }

            resultContainer.classList.add('fade-in');
        }

        // Create Confetti
        function createConfetti() {
            const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }
        }

        // Restart Quiz
        function restartQuiz() {
            startQuiz();
        }

        // Initialize on load
        document.addEventListener('DOMContentLoaded', init);
