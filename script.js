document.addEventListener('DOMContentLoaded', () => {

    // --- Animated Cursor ---
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- Typing Animation ---
    const roles = ["an AI Engineer", "an ML Enthusiast", "a Full-Stack Developer", "a Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    const typingTextElement = document.querySelector('.typing-text');
    if (typingTextElement) {
        function type() {
            if (charIndex < roles[roleIndex].length) {
                typingTextElement.textContent += roles[roleIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                setTimeout(erase, 2000);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typingTextElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 50);
            } else {
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 500);
            }
        }
        type();
    }

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- NEW: Manually Set Coding Stats ---
    function setStaticStats() {
        // --- UPDATE YOUR STATS HERE ---
        const stats = {
            leetcode: 319,
            gfg: 271,
            hackerrank: 25, // Number of badges
            codechef: 56
        };
        // ------------------------------

        // Display individual stats
        document.getElementById('leetcode-solved').textContent = stats.leetcode;
        document.getElementById('gfg-solved').textContent = stats.gfg;
        document.getElementById('hackerrank-badges').textContent = stats.hackerrank;
        document.getElementById('codechef-solved').textContent = stats.codechef;

        // Calculate and set the total for the animation
        const totalProblems = stats.leetcode + stats.gfg + stats.codechef;
        const totalCounter = document.getElementById('total-solved-count');
        totalCounter.setAttribute('data-goal', totalProblems);
    }


    // --- Animated Counter Logic ---
    let counterAnimated = false;
    function animateCounter(element, duration = 2000) {
        const goal = parseInt(element.getAttribute('data-goal'), 10);
        if (counterAnimated || isNaN(goal) || goal === 0) return;
        
        counterAnimated = true; // Prevents re-animating on scroll
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime > duration) {
                element.textContent = goal;
                return;
            }
            const progress = elapsedTime / duration;
            const currentCount = Math.floor(progress * goal);
            element.textContent = currentCount;
            requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
    }

    // --- Certificate Carousel & Dots Navigation ---
    const container = document.querySelector('.certificate-container');
    const cards = document.querySelectorAll('.certificate-card');
    const dotsContainer = document.querySelector('.scroll-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (container && cards.length > 0 && dotsContainer && prevBtn && nextBtn) {
        let currentIndex = 0;
        dotsContainer.innerHTML = '';
        const dotTargetIndices = [0, Math.floor((cards.length - 1) / 2), cards.length - 1];
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dotsContainer.appendChild(dot);
        }
        const dots = document.querySelectorAll('.dot');

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const targetCardIndex = dotTargetIndices[index];
                cards[targetCardIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });
        });

        const updateCarouselUI = (newIndex) => {
            currentIndex = newIndex;
            const totalCards = cards.length;
            let activeDotIndex;
            if (currentIndex < totalCards / 3) activeDotIndex = 0;
            else if (currentIndex < (2 * totalCards) / 3) activeDotIndex = 1;
            else activeDotIndex = 2;
            dots.forEach((d, i) => d.classList.toggle('active', i === activeDotIndex));
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalCards - 1;
        };

        nextBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(container).gap);
            container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(container).gap);
            container.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        });

        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(cards).indexOf(entry.target);
                    updateCarouselUI(index);
                }
            });
        }, { root: container, threshold: 0.7 });

        cards.forEach(card => carouselObserver.observe(card));
        updateCarouselUI(0);
    }
    
    // --- Unified Intersection Observer for All Scroll Animations ---
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'show' class to fade in the element
                entry.target.classList.add('show');

                // Specifically trigger the counter animation
                if (entry.target.id === 'coding-profiles') {
                    animateCounter(document.getElementById('total-solved-count'));
                }
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all elements that need a scroll-in animation
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => animationObserver.observe(el));

    // --- INITIATE STATS DISPLAY ---
    setStaticStats();
});