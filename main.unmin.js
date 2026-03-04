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

// ── Wall ──
(function() {
    const wallGrid = document.getElementById('wall-grid');
    if (!wallGrid) return;

    const STORIES_PER_PAGE = 20;
    let allStories = [];
    let displayedCount = 0;
    let selectedRole = null;
    let tickerInterval = null;

    function daysAgo(n) {
        const d = new Date();
        d.setDate(d.getDate() - n);
        d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        return d.toISOString();
    }

    function timeAgo(dateStr) {
        const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
        const days = Math.floor(seconds / 86400);
        if (days === 1) return 'yesterday';
        if (days < 30) return days + ' days ago';
        return Math.floor(days / 30) + ' months ago';
    }

    function roleLabel(role) {
        if (role === 'parent') return 'Parent';
        if (role === 'student') return 'Former Student';
        if (role === 'teacher') return 'Teacher';
        return null;
    }

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const seedStories = [
        { id: 1, content: "My son came home with bruises three times in one month. Each time I reported it, they said they would 'look into it.' By the fourth time, I pulled him out. Best decision I ever made.", role: "parent", created_at: daysAgo(1), reactions: 0 },
        { id: 2, content: "I had a panic attack in 8th grade math class. The teacher told me to stop being dramatic and sit down. I did not tell anyone about my anxiety for three more years.", role: "student", created_at: daysAgo(2), reactions: 0 },
        { id: 3, content: "My daughter was reading chapter books at 5. They made her sit through phonics lessons for two years because 'that is the curriculum.' She went from loving books to hating school.", role: "parent", created_at: daysAgo(1), reactions: 0 },
        { id: 4, content: "I taught 4th grade for 12 years. I left because I spent more time on standardized test prep than actual teaching. The kids deserved better. I deserved better.", role: "teacher", created_at: daysAgo(3), reactions: 0 },
        { id: 5, content: "We had 3 minutes between classes and needed a hall pass to use the bathroom. I got a UTI in 7th grade because I was too afraid to ask.", role: "student", created_at: daysAgo(4), reactions: 0 },
        { id: 6, content: "It took 14 months to get my son's IEP evaluated. Fourteen months of him falling further behind while the district dragged their feet.", role: "parent", created_at: daysAgo(2), reactions: 0 },
        { id: 7, content: "I had 20 minutes for lunch. By the time I got through the line, I had 8 minutes to eat. I threw away more food than I ate for four years.", role: "student", created_at: daysAgo(5), reactions: 0 },
        { id: 8, content: "I found out my daughter was being pulled out of class for 'behavioral issues' three weeks after it started. Nobody called me. Nobody emailed. She was sitting in the hallway alone.", role: "parent", created_at: daysAgo(3), reactions: 0 },
        { id: 9, content: "A student threw a chair at me in my second year. Administration told me to 'build a better relationship with him.' No suspension. No consequences. I quit that June.", role: "teacher", created_at: daysAgo(6), reactions: 0 },
        { id: 10, content: "I wanted to write a poem for my English assignment. My teacher said it had to be a five-paragraph essay. I was 16 and already learning that creativity did not matter.", role: "student", created_at: daysAgo(4), reactions: 0 },
        { id: 11, content: "The school counselor suggested we medicate our 6-year-old because he could not sit still for 6 hours. He was six. He was supposed to move.", role: "parent", created_at: daysAgo(1), reactions: 0 },
        { id: 12, content: "I ate lunch in a bathroom stall for all of 9th grade. Not one teacher noticed. Not one adult asked where I was.", role: "student", created_at: daysAgo(7), reactions: 0 },
        { id: 13, content: "My kid tested gifted in 2nd grade. Their 'gifted program' was extra worksheets. Same classroom. Same pace. Just more busywork.", role: "parent", created_at: daysAgo(5), reactions: 0 },
        { id: 14, content: "I spent $2,400 of my own money on classroom supplies last year. When I asked for a budget increase, they said there was no room. The superintendent got a $15,000 raise.", role: "teacher", created_at: daysAgo(8), reactions: 0 },
        { id: 15, content: "Every Sunday night I could not sleep because of the dread. I was 10 years old. No child should dread Monday that much.", role: "student", created_at: daysAgo(3), reactions: 0 },
        { id: 16, content: "There was a lockdown drill where the kids had to hide under desks and be silent for 45 minutes. My 7-year-old asked me that night if someone was going to shoot her at school.", role: "parent", created_at: daysAgo(2), reactions: 0 },
        { id: 17, content: "I got dress coded for wearing a tank top in 95-degree weather. The boy next to me was shirtless at recess. I was 11 and already learning the rules were different for me.", role: "student", created_at: daysAgo(6), reactions: 0 },
        { id: 18, content: "My son's third grade teacher told me he was 'on level.' I tested him privately. He was reading at a first grade level. They just kept passing him along.", role: "parent", created_at: daysAgo(4), reactions: 0 },
        { id: 19, content: "I cried in my car every morning before work for the last three months of my teaching career. I loved the kids. I could not survive the system.", role: "teacher", created_at: daysAgo(9), reactions: 0 },
        { id: 20, content: "I got detention for being 2 minutes late to class because I was helping a kid who fell in the hallway. Zero tolerance meant zero common sense.", role: "student", created_at: daysAgo(5), reactions: 0 },
        { id: 21, content: "My daughter's 'friends' at school made a group chat specifically to exclude her. When I told the school, they said it happened off campus so it was not their problem.", role: "parent", created_at: daysAgo(3), reactions: 0 },
        { id: 22, content: "My son told his teacher he was having a hard time at home. She said 'everyone has bad days' and moved on. He was trying to tell her something real.", role: "parent", created_at: daysAgo(7), reactions: 0 },
        { id: 23, content: "I finished every assignment early and then sat there. For years. No extra books. No enrichment. Just sit there and be quiet. They taught me that being smart was boring.", role: "student", created_at: daysAgo(2), reactions: 0 },
        { id: 24, content: "A 9-year-old cried during state testing because she thought she would be held back if she failed. She was shaking. I was not allowed to comfort her. Proctoring rules.", role: "teacher", created_at: daysAgo(10), reactions: 0 },
        { id: 25, content: "The school told me my kid was fine. My gut said otherwise. I pulled her out mid-year. Within two months of homeschooling, she was a completely different child. Trust your instincts.", role: "parent", created_at: daysAgo(1), reactions: 0 }
    ];

    // Toast ticker
    function initTicker() {
        const container = document.querySelector('.wall-toast-container');
        if (!container || allStories.length === 0) return;

        const shuffled = shuffle(allStories);
        let idx = 0;

        function showToast() {
            const story = shuffled[idx];
            idx = (idx + 1) % shuffled.length;

            const label = roleLabel(story.role);
            const metaText = label
                ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() + ' shared ' + timeAgo(story.created_at) + '...'
                : 'Someone shared ' + timeAgo(story.created_at) + '...';

            const excerpt = story.content.length > 160
                ? story.content.slice(0, 157) + '...'
                : story.content;

            const toast = document.createElement('div');
            toast.className = 'wall-toast';
            toast.innerHTML =
                '<div class="wall-toast-meta">' + metaText + '</div>' +
                '<div class="wall-toast-body">' + excerpt +
                (story.content.length > 160 ? ' <span class="read-more">Read more &rarr;</span>' : '') +
                '</div>';

            toast.addEventListener('click', function() {
                const card = document.getElementById('wall-card-' + story.id);
                if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            container.innerHTML = '';
            container.appendChild(toast);

            setTimeout(function() {
                toast.classList.add('toast-out');
                setTimeout(showToast, 400);
            }, 5000);
        }

        showToast();
    }

    // Reactions localStorage
    var REACTED_KEY = 'wall_reacted';
    function getReacted() {
        try { return JSON.parse(localStorage.getItem(REACTED_KEY) || '[]'); } catch(e) { return []; }
    }
    function saveReacted(id) {
        var arr = getReacted();
        if (arr.indexOf(id) === -1) { arr.push(id); localStorage.setItem(REACTED_KEY, JSON.stringify(arr)); }
    }
    function removeReacted(id) {
        var arr = getReacted();
        var idx = arr.indexOf(id);
        if (idx !== -1) { arr.splice(idx, 1); localStorage.setItem(REACTED_KEY, JSON.stringify(arr)); }
    }
    function hasReacted(id) { return getReacted().indexOf(id) !== -1; }

    // Wall grid
    function renderCard(story) {
        const label = roleLabel(story.role);
        const count = story.reactions || 0;
        const reacted = hasReacted(story.id);
        var shareText = story.content.length > 200 ? story.content.substring(0, 200) + '...' : story.content;
        return '<div class="wall-card" id="wall-card-' + story.id + '">' +
            (label ? '<div class="wall-card-role">' + label + '</div>' : '') +
            '<div class="wall-card-text">' + story.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
            '<div class="wall-card-footer">' +
                '<div class="wall-card-actions">' +
                    '<button class="wall-react-btn' + (reacted ? ' reacted' : '') + '" data-id="' + story.id + '">' +
                        '<span class="react-emoji">&#x1F631;</span> <span class="react-count">' + count + '</span>' +
                    '</button>' +
                    '<button class="wall-share-btn" data-text="' + shareText.replace(/"/g, '&quot;') + '" title="Share this story">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>' +
                    '</button>' +
                '</div>' +
                '<span class="wall-card-time">' + timeAgo(story.created_at) + '</span>' +
            '</div>' +
            '</div>';
    }

    function renderWall() {
        const end = Math.min(displayedCount + STORIES_PER_PAGE, allStories.length);
        let html = '';
        for (let i = displayedCount; i < end; i++) {
            html += renderCard(allStories[i]);
        }
        wallGrid.insertAdjacentHTML('beforeend', html);
        displayedCount = end;

        const loadMoreBtn = document.getElementById('wall-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = displayedCount < allStories.length ? 'inline-flex' : 'none';
        }
    }

    // Share click handler
    if (wallGrid) {
        wallGrid.addEventListener('click', function(e) {
            var shareBtn = e.target.closest('.wall-share-btn');
            if (!shareBtn) return;
            var text = shareBtn.dataset.text;
            var shareData = {
                title: 'School Optional - The Wall',
                text: '"' + text + '"',
                url: 'https://schooloptional.com/wall'
            };
            if (navigator.share) {
                navigator.share(shareData).catch(function() {});
            } else {
                var tweetText = encodeURIComponent('"' + (text.length > 240 ? text.substring(0, 240) + '...' : text) + '"');
                var tweetUrl = encodeURIComponent('https://schooloptional.com/wall');
                window.open('https://twitter.com/intent/tweet?text=' + tweetText + '&url=' + tweetUrl, '_blank', 'width=550,height=420');
            }
        });
    }

    // Reaction click handler (event delegation) - toggle on/off
    if (wallGrid) {
        wallGrid.addEventListener('click', function(e) {
            if (e.target.closest('.wall-share-btn')) return;
            var btn = e.target.closest('.wall-react-btn');
            if (!btn) return;

            var id = parseInt(btn.dataset.id, 10);
            if (!id) return;

            var countEl = btn.querySelector('.react-count');
            var current = parseInt(countEl.textContent, 10) || 0;
            var alreadyReacted = btn.classList.contains('reacted');

            if (alreadyReacted) {
                btn.classList.remove('reacted');
                countEl.textContent = Math.max(0, current - 1);
                removeReacted(id);
                fetch('/api/react', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id, undo: true })
                }).then(function(res) { return res.json(); }).then(function(data) {
                    if (data.ok && data.reactions !== undefined) {
                        countEl.textContent = data.reactions;
                    }
                }).catch(function() {});
            } else {
                btn.classList.add('reacted');
                countEl.textContent = current + 1;
                saveReacted(id);
                fetch('/api/react', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id })
                }).then(function(res) { return res.json(); }).then(function(data) {
                    if (data.ok && data.reactions !== undefined) {
                        countEl.textContent = data.reactions;
                    }
                }).catch(function() {});
            }
        });
    }

    // Form
    function initForm() {
        const form = document.getElementById('wall-form');
        const input = document.getElementById('wall-input');
        const charSpan = document.getElementById('wall-chars');
        const charCount = document.querySelector('.wall-char-count');
        const successEl = document.querySelector('.wall-form-success');
        if (!form || !input) return;

        input.addEventListener('input', function() {
            const len = input.value.length;
            charSpan.textContent = len;
            if (charCount) {
                charCount.classList.toggle('near-limit', len > 900);
            }
        });

        document.querySelectorAll('.wall-role').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const wasActive = btn.classList.contains('active');
                document.querySelectorAll('.wall-role').forEach(function(b) { b.classList.remove('active'); });
                if (!wasActive) {
                    btn.classList.add('active');
                    selectedRole = btn.dataset.role;
                } else {
                    selectedRole = null;
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const content = input.value.trim();
            if (content.length < 50) {
                input.setCustomValidity('Please write at least 50 characters.');
                input.reportValidity();
                return;
            }
            input.setCustomValidity('');

            const submitBtn = form.querySelector('.wall-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            fetch('/api/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content, role: selectedRole })
            }).then(function() {
                form.style.display = 'none';
                successEl.style.display = 'block';
            }).catch(function() {
                form.style.display = 'none';
                successEl.style.display = 'block';
            });
        });
    }

    // Load more
    var loadMoreBtn = document.getElementById('wall-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderWall);
    }

    // Init
    async function init() {
        try {
            const res = await fetch('/api/stories');
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    // Merge API stories with seeds — API first, then fill with seeds
                    var apiIds = {};
                    data.forEach(function(s) { apiIds[s.id] = true; });
                    var extraSeeds = seedStories.filter(function(s) { return !apiIds[s.id]; });
                    allStories = data.concat(extraSeeds);
                } else {
                    allStories = seedStories;
                }
            } else {
                allStories = seedStories;
            }
        } catch(e) {
            allStories = seedStories;
        }
        renderWall();
        initTicker();
        initForm();
    }

    init();
})();
