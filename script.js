// Initialize GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Entrance Animation
    gsap.from('.glass-card', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: 'elastic.out(1, 0.75)',
        delay: 0.5
    });

    gsap.from('.emoji-container', {
        duration: 1.2,
        scale: 0,
        rotation: -180,
        ease: 'back.out(1.7)',
        delay: 1.2
    });

    // Create floating hearts
    createFloatingHearts();

    // Password Validation Logic
    const passwordBtn = document.getElementById('password-btn');
    const passwordInput = document.getElementById('password-input');
    const passwordScreen = document.getElementById('password-screen');
    const mainContent = document.getElementById('main-content');
    const errorMsg = document.getElementById('password-error');

    const checkPassword = () => {
        const password = passwordInput.value.toLowerCase().trim();
        if (password === 'i love you') {
            gsap.to(passwordScreen, {
                duration: 1,
                y: -1000,
                opacity: 0,
                ease: 'power4.in',
                onComplete: () => {
                    passwordScreen.style.display = 'none';
                    mainContent.style.display = 'block';
                    document.getElementById('quote-container').style.display = 'block';
                    startQuoteRotation();

                    // Auto-start music if possible (modern browser friendly)
                    music.play().then(() => {
                        musicOnIco.style.display = 'block';
                        musicOffIco.style.display = 'none';
                    }).catch(e => console.log("Auto-play prevented", e));

                    gsap.to(mainContent, {
                        duration: 1,
                        opacity: 1,
                        ease: 'power2.out'
                    });
                }
            });
        } else {
            errorMsg.style.display = 'block';
            gsap.fromTo(passwordInput,
                { x: -10 },
                { x: 10, repeat: 5, duration: 0.05, yoyo: true }
            );
        }
    };

    passwordBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    // Sparkle Effect Logic
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) { // Limit frequency
            createSparkle(e.pageX, e.pageY);
        }
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.innerHTML = '✨';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.fontSize = (Math.random() * 10 + 10) + 'px';

        document.body.appendChild(sparkle);

        gsap.to(sparkle, {
            duration: 1 + Math.random(),
            y: y - 50 - Math.random() * 50,
            x: x + (Math.random() - 0.5) * 50,
            opacity: 0,
            rotation: Math.random() * 360,
            ease: 'power1.out',
            onComplete: () => sparkle.remove()
        });
    }

    // Subtle 3D Tilt Effect
    const card = document.getElementById('main-card');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        gsap.to(card, {
            rotationY: xAxis,
            rotationX: -yAxis,
            ease: 'power2.out',
            duration: 0.5
        });
    });
});

// Floating Hearts Background Logic
function createFloatingHearts() {
    const bg = document.getElementById('heart-bg');
    const heartCount = 40;
    const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1'];

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';

        // Randomize
        const size = Math.random() * 20 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        heart.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}">
            <path fill="${color}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`;

        heart.style.left = `${left}%`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;

        bg.appendChild(heart);
    }
}

// "No" Button Logic - The Dodge & Unclickable
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');

const moveButton = () => {
    // Random position within viewport, leaving some padding
    const padding = 50;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    // Instant teleport or very fast slide
    gsap.to(noBtn, {
        duration: 0.1, // Much faster for "unclickable" feel
        x: randomX - noBtn.offsetLeft,
        y: randomY - noBtn.offsetTop,
        ease: 'power3.out'
    });
};

// Event listeners for dodging
noBtn.addEventListener('mouseenter', moveButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Stop mobile selection
    moveButton();
});

// Explicitly make it unclickable
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveButton();
    return false;
});
noBtn.addEventListener('mousedown', (e) => e.preventDefault());

// "Yes" Button Logic - The Success
yesBtn.addEventListener('click', () => {
    // 1. Confetti Explosion
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    // 2. Transition screens
    gsap.to('#main-card', {
        duration: 0.8,
        scale: 0.5,
        opacity: 0,
        display: 'none',
        ease: 'power4.in',
        onComplete: () => {
            const success = document.getElementById('success-screen');
            success.style.display = 'block';
            gsap.from('.success-content', {
                duration: 1.2,
                y: 100,
                opacity: 0,
                ease: 'elastic.out(1, 0.75)'
            });
        }
    });

    // 3. One big burst center
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#ffffff']
    });
});

// Romantic Quotes Logic
function startQuoteRotation() {
    const quotes = [
        "In your smile, I see something more beautiful than the stars.",
        "You are my today and all of my tomorrows.",
        "I love you more than words can ever express.",
        "You're the best thing that ever happened to me.",
        "Everything I do, I do it for you."
    ];
    let index = 0;
    const quoteElement = document.getElementById('romantic-quote');

    function nextQuote() {
        gsap.to(quoteElement, {
            opacity: 0,
            y: 10,
            duration: 1,
            onComplete: () => {
                quoteElement.innerText = quotes[index];
                index = (index + 1) % quotes.length;
                gsap.to(quoteElement, {
                    opacity: 1,
                    y: 0,
                    duration: 1
                });
            }
        });
    }

    nextQuote();
    setInterval(nextQuote, 5000);
}

// Music Control
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
const musicOnIco = document.getElementById('music-on');
const musicOffIco = document.getElementById('music-off');

musicBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicOnIco.style.display = 'block';
        musicOffIco.style.display = 'none';
        musicBtn.title = 'Mute';
    } else {
        music.pause();
        musicOnIco.style.display = 'none';
        musicOffIco.style.display = 'block';
        musicBtn.title = 'Play Romantic Music';
    }
});
