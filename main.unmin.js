// School Optional - Site JS v2
// Scroll animations, counters, progress bar, quiz engine

// ── Mobile Menu ──
const toggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
}

document.addEventListener('click', (e) => {
    if (mobileMenu && toggle && !mobileMenu.contains(e.target) && !toggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
    }
});

// ── Smooth Scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            if (mobileMenu) mobileMenu.classList.remove('open');
        }
    });
});

// ── Scroll Reveal ──
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ── Animated Number Counters ──
const counterElements = document.querySelectorAll('[data-count]');

if (counterElements.length > 0) {
    const animateCounter = (el) => {
        const target = el.getAttribute('data-count');
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
        const duration = 1500;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericTarget);

            if (target.includes('.')) {
                el.textContent = prefix + (eased * numericTarget).toFixed(1) + suffix;
            } else {
                el.textContent = prefix + current.toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = prefix + target + suffix;
            }
        };

        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
}

// ── Reading Progress Bar ──
const progressBar = document.querySelector('.reading-progress');

if (progressBar) {
    const articleBody = document.querySelector('.article-body');

    if (articleBody) {
        const updateProgress = () => {
            const bodyRect = articleBody.getBoundingClientRect();
            const bodyTop = bodyRect.top + window.pageYOffset;
            const bodyHeight = bodyRect.height;
            const scrolled = window.pageYOffset - bodyTop + window.innerHeight * 0.3;
            const progress = Math.max(0, Math.min(100, (scrolled / bodyHeight) * 100));
            progressBar.style.width = progress + '%';
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        updateProgress();
    }
}

// ── Quiz Engine ──
const quizContainer = document.querySelector('.quiz-container');

if (quizContainer) {
    const questions = [
        {
            q: "How satisfied are you with your child's current academic progress?",
            options: [
                { text: "Very satisfied - they're thriving", score: 0 },
                { text: "Mostly satisfied, but there are gaps", score: 1 },
                { text: "Concerned - they're falling behind", score: 2 },
                { text: "Very concerned - the system is failing them", score: 3 }
            ]
        },
        {
            q: "How does your child feel about going to school each day?",
            options: [
                { text: "Excited and happy", score: 0 },
                { text: "Neutral - it's fine", score: 1 },
                { text: "Reluctant or anxious", score: 2 },
                { text: "Dreads it or frequently resists going", score: 3 }
            ]
        },
        {
            q: "Have you ever thought about pulling your child out of traditional school?",
            options: [
                { text: "Never crossed my mind", score: 0 },
                { text: "Briefly, but dismissed it", score: 1 },
                { text: "Yes, I've seriously considered it", score: 2 },
                { text: "I'm actively researching alternatives", score: 3 }
            ]
        },
        {
            q: "What concerns you most about the school environment?",
            options: [
                { text: "Nothing major - it seems safe and positive", score: 0 },
                { text: "Some social issues (bullying, peer pressure)", score: 1 },
                { text: "Safety concerns (security, supervision)", score: 2 },
                { text: "Multiple serious concerns (safety, values, quality)", score: 3 }
            ]
        },
        {
            q: "How much time does your child spend on homework and school-related stress?",
            options: [
                { text: "Minimal - they handle it easily", score: 0 },
                { text: "Moderate - takes up most evenings", score: 1 },
                { text: "Excessive - leaves little time for anything else", score: 2 },
                { text: "It's consuming their childhood", score: 3 }
            ]
        },
        {
            q: "Do you feel you have a say in what and how your child learns?",
            options: [
                { text: "Yes, the school involves us in decisions", score: 0 },
                { text: "Somewhat - we can suggest but not decide", score: 1 },
                { text: "Not really - the curriculum is fixed", score: 2 },
                { text: "Zero input - take it or leave it", score: 3 }
            ]
        },
        {
            q: "How would you describe your family's schedule flexibility?",
            options: [
                { text: "Fixed 9-5 jobs, school schedule works fine", score: 0 },
                { text: "Some flexibility but school hours are manageable", score: 1 },
                { text: "One parent could be available during school hours", score: 2 },
                { text: "We have significant schedule flexibility", score: 3 }
            ]
        },
        {
            q: "How does your child learn best?",
            options: [
                { text: "Thrives in a structured classroom setting", score: 0 },
                { text: "Does okay in class but learns better one-on-one", score: 1 },
                { text: "Learns best through hands-on or self-directed activities", score: 2 },
                { text: "The classroom format actively hinders their learning", score: 3 }
            ]
        },
        {
            q: "What's your biggest concern about homeschooling?",
            options: [
                { text: "I couldn't teach my child effectively", score: 0 },
                { text: "Socialization - they'd miss out on friends", score: 1 },
                { text: "Logistics - how to manage work and teaching", score: 2 },
                { text: "Compliance - understanding my state's legal requirements", score: 3 }
            ]
        },
        {
            q: "If you knew your state's requirements and had a tool to handle compliance, would you consider homeschooling?",
            options: [
                { text: "Probably not - school works for us", score: 0 },
                { text: "Maybe - I'd want to learn more first", score: 1 },
                { text: "Very likely - compliance is my main barrier", score: 2 },
                { text: "Absolutely - that's exactly what I need", score: 3 }
            ]
        }
    ];

    const results = [
        {
            min: 0, max: 10,
            title: "School is working for your family",
            desc: "Based on your answers, traditional school seems like a solid fit right now. That's great! But things change - and it's smart that you're exploring options. Bookmark this page and come back if your situation shifts.",
            articles: [
                { title: "The Socialization Myth", url: "/articles/socialization-myth" },
                { title: "The Reading Collapse", url: "/articles/reading-collapse" }
            ]
        },
        {
            min: 11, max: 20,
            title: "You're seeing the cracks",
            desc: "Your answers suggest real concerns with the current system. You're not alone - millions of families are in the same spot. The good news? Homeschooling is simpler, more flexible, and more effective than most people think.",
            articles: [
                { title: "The Hard Truth About Public School", url: "/articles/hard-truth-about-public-school" },
                { title: "Keep Them With You", url: "/articles/keep-them-with-you" },
                { title: "The Quarter They Stole", url: "/articles/quarter-they-stole" }
            ]
        },
        {
            min: 21, max: 30,
            title: "You're ready to make the switch",
            desc: "Your answers paint a clear picture: the current system isn't serving your child. The research backs you up. Homeschooled students score at the 87th percentile on average. And with Blue Folder, compliance is handled for you.",
            articles: [
                { title: "The Hard Truth About Public School", url: "/articles/hard-truth-about-public-school" },
                { title: "The Trap", url: "/articles/the-trap" },
                { title: "The Adults in the Building", url: "/articles/adults-in-the-building" }
            ]
        }
    ];

    let currentQuestion = 0;
    let answers = new Array(questions.length).fill(-1);

    const renderQuiz = () => {
        let html = '';

        // Progress
        html += '<div class="quiz-step-label">Question <span id="quiz-current">' + (currentQuestion + 1) + '</span> of ' + questions.length + '</div>';
        html += '<div class="quiz-progress"><div class="quiz-progress-fill" id="quiz-progress-fill"></div></div>';

        // Questions
        questions.forEach((q, qi) => {
            html += '<div class="quiz-question' + (qi === currentQuestion ? ' active' : '') + '" data-q="' + qi + '">';
            html += '<h2>' + q.q + '</h2>';
            html += '<div class="quiz-options">';
            q.options.forEach((opt, oi) => {
                const selected = answers[qi] === oi ? ' selected' : '';
                html += '<button class="quiz-option' + selected + '" data-q="' + qi + '" data-o="' + oi + '">';
                html += '<span class="quiz-option-marker"></span>';
                html += '<span>' + opt.text + '</span>';
                html += '</button>';
            });
            html += '</div>';
            html += '<div class="quiz-nav">';
            if (qi > 0) {
                html += '<button class="btn btn-secondary quiz-prev">Back</button>';
            } else {
                html += '<span></span>';
            }
            if (qi < questions.length - 1) {
                html += '<button class="btn btn-primary quiz-next"' + (answers[qi] === -1 ? ' disabled' : '') + '>Next</button>';
            } else {
                html += '<button class="btn btn-primary quiz-submit"' + (answers[qi] === -1 ? ' disabled' : '') + '>See My Results</button>';
            }
            html += '</div>';
            html += '</div>';
        });

        // Results
        html += '<div class="quiz-results" id="quiz-results"></div>';

        quizContainer.innerHTML = html;
        updateProgress();
        bindQuizEvents();
    };

    const updateProgress = () => {
        const fill = document.getElementById('quiz-progress-fill');
        const label = document.getElementById('quiz-current');
        if (fill) fill.style.width = ((currentQuestion + 1) / questions.length * 100) + '%';
        if (label) label.textContent = currentQuestion + 1;
    };

    const showQuestion = (index) => {
        currentQuestion = index;
        document.querySelectorAll('.quiz-question').forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
        updateProgress();
    };

    const showResults = () => {
        const totalScore = answers.reduce((sum, ansIdx, qi) => {
            return sum + (ansIdx >= 0 ? questions[qi].options[ansIdx].score : 0);
        }, 0);

        const result = results.find(r => totalScore >= r.min && totalScore <= r.max) || results[results.length - 1];
        const pct = Math.round((totalScore / 30) * 100);
        const circumference = 2 * Math.PI * 70; // r=70

        // Hide questions, show results
        document.querySelectorAll('.quiz-question').forEach(el => el.classList.remove('active'));
        document.querySelector('.quiz-step-label').style.display = 'none';
        document.querySelector('.quiz-progress').style.display = 'none';

        const resultsEl = document.getElementById('quiz-results');
        let html = '';

        html += '<div class="quiz-score-ring">';
        html += '<svg viewBox="0 0 160 160"><circle class="ring-bg" cx="80" cy="80" r="70"/>';
        html += '<circle class="ring-fill" cx="80" cy="80" r="70" id="score-ring"/></svg>';
        html += '<div class="quiz-score-number" id="score-num">0</div>';
        html += '<div class="quiz-score-label">match score</div>';
        html += '</div>';

        html += '<h2 class="quiz-result-title">' + result.title + '</h2>';
        html += '<p class="quiz-result-desc">' + result.desc + '</p>';

        html += '<div class="quiz-result-actions">';
        if (totalScore > 10) {
            html += '<a href="/resources" class="btn btn-primary btn-lg">See My Toolkit</a>';
        }
        html += '<a href="/articles" class="btn btn-secondary btn-lg">Read the Research</a>';
        html += '</div>';

        html += '<div class="quiz-result-detail">';
        html += '<h4>Recommended Reading</h4>';
        html += '<ul>';
        result.articles.forEach(a => {
            html += '<li><a href="' + a.url + '" style="color: var(--accent);">' + a.title + '</a></li>';
        });
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-top: 32px;">';
        html += '<button class="btn btn-ghost quiz-retake">Retake Quiz</button>';
        html += '</div>';

        resultsEl.innerHTML = html;
        resultsEl.classList.add('active');

        // Animate score ring
        requestAnimationFrame(() => {
            const ring = document.getElementById('score-ring');
            const numEl = document.getElementById('score-num');
            if (ring) {
                const dashoffset = circumference - (pct / 100) * circumference;
                ring.style.strokeDasharray = circumference;
                ring.style.strokeDashoffset = circumference;
                requestAnimationFrame(() => {
                    ring.style.strokeDashoffset = dashoffset;
                });
            }

            // Animate number
            if (numEl) {
                let current = 0;
                const duration = 1200;
                const start = performance.now();
                const step = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    current = Math.round(eased * pct);
                    numEl.textContent = current + '%';
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        });

        // Retake
        const retakeBtn = resultsEl.querySelector('.quiz-retake');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => {
                answers = new Array(questions.length).fill(-1);
                currentQuestion = 0;
                renderQuiz();
                window.scrollTo({ top: quizContainer.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
            });
        }

        // Scroll to results
        window.scrollTo({ top: resultsEl.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
    };

    const bindQuizEvents = () => {
        // Option selection
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const qi = parseInt(btn.getAttribute('data-q'));
                const oi = parseInt(btn.getAttribute('data-o'));
                answers[qi] = oi;

                // Update selected states
                const questionEl = btn.closest('.quiz-question');
                questionEl.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
                btn.classList.add('selected');

                // Enable next/submit button
                const nextBtn = questionEl.querySelector('.quiz-next, .quiz-submit');
                if (nextBtn) nextBtn.removeAttribute('disabled');
            });
        });

        // Next button
        document.querySelectorAll('.quiz-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentQuestion < questions.length - 1) {
                    showQuestion(currentQuestion + 1);
                }
            });
        });

        // Back button
        document.querySelectorAll('.quiz-prev').forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentQuestion > 0) {
                    showQuestion(currentQuestion - 1);
                }
            });
        });

        // Submit
        document.querySelectorAll('.quiz-submit').forEach(btn => {
            btn.addEventListener('click', showResults);
        });
    };

    renderQuiz();
}
