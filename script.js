// ==========================================
// ПРОВЕРКА ШИРИНЫ ЭКРАНА (динамическая)
// ==========================================
const isMobile = () => window.innerWidth <= 600;

// ==========================================
// 1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
}

// ==========================================
// 2. 3D-ЭФФЕКТ HERO (только десктоп)
// ==========================================
const heroCard = document.getElementById('heroCard');

if (heroCard && !isMobile()) {
    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ==========================================
// 3. АНИМИРОВАННЫЙ ТЕКСТ В HERO
// ==========================================
const typedElement = document.getElementById('typed');
const phrases = [
    'Фуллстэк-разработчик',
    'Вратарь',
    'Автолюбитель',
    'Меломан'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = '';

function type() {
    const fullPhrase = phrases[phraseIndex];
    if (isDeleting) {
        currentText = fullPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        currentText = fullPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    typedElement.textContent = currentText;
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === fullPhrase.length) {
        typeSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}
type();

// ==========================================
// 4. ТАБЫ В СЕКЦИИ «ЛЮБИМОЕ»
// ==========================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// ==========================================
// 5. ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ
// ==========================================
const sections = document.querySelectorAll('.section');

function restartStaggerAnimations(section) {
    const staggerItems = section.querySelectorAll('.stagger-item');
    staggerItems.forEach((item, index) => {
        item.style.transitionDelay = (index * 0.1) + 's';
        void item.offsetWidth;
    });
}

function restartProgressBars(section) {
    const skillCards = section.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const progress = card.dataset.progress;
        const fill = card.querySelector('.progress-fill');
        if (progress && fill) {
            fill.style.width = '0';
            void fill.offsetWidth;
            fill.style.width = progress + '%';
        }
    });
}

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            section.classList.add('visible');

            restartStaggerAnimations(section);

            if (section.id === 'skills') {
                restartProgressBars(section);
            }
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => sectionObserver.observe(section));

// ==========================================
// 6. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            if (isMobile()) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                const snapContainer = document.querySelector('.snap-container');
                snapContainer.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ==========================================
// 7. КНОПКА «НАВЕРХ»
// ==========================================
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
    const scrollTop = isMobile() ? window.scrollY : document.querySelector('.snap-container').scrollTop;
    if (scrollTop > window.innerHeight * 0.5) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

if (isMobile()) {
    window.addEventListener('scroll', toggleBackToTop);
} else {
    document.querySelector('.snap-container').addEventListener('scroll', toggleBackToTop);
}

backToTopBtn.addEventListener('click', () => {
    if (isMobile()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        document.querySelector('.snap-container').scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ==========================================
// 8. PRELOADER
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    }
});

// ==========================================
// 9. КНОПКА ЧЕЛОВЕКА-ПАУКА И ФРАЗА ДЯДИ БЕНА
// ==========================================
const spiderBtn = document.getElementById('spiderBtn');
const spiderQuote = document.getElementById('spiderQuote');

let lastClickTime = 0;

if (spiderBtn && spiderQuote) {
    spiderBtn.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime < 300) {
            // Двойной клик
            if (!isMobile()) {
                openSnakeGame();
            }
            lastClickTime = 0;
        } else {
            // Одиночный клик
            if (!body.classList.contains('dark')) {
                body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            spiderQuote.classList.remove('show');
            void spiderQuote.offsetWidth;
            spiderQuote.classList.add('show');
        }
        lastClickTime = now;
    });
}

// ==========================================
// 10. ПАСХАЛКА «ЗМЕЙКА» (ТОЛЬКО ДЕСКТОП)
// ==========================================
const snakeModal = document.getElementById('snakeModal');
const snakeLoading = document.getElementById('snakeLoading');
const snakeIntro = document.getElementById('snakeIntro');
const snakeGameScreen = document.getElementById('snakeGame');
const snakeGameOverScreen = document.getElementById('snakeGameOver');
const snakeStartBtn = document.getElementById('snakeStartBtn');
const snakeRestartBtn = document.getElementById('snakeRestartBtn');
const snakeExitBtn = document.getElementById('snakeExitBtn');
const snakeClose = document.getElementById('snakeClose');
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeScoreSpan = document.getElementById('snakeScore');
const snakeFinalScoreSpan = document.getElementById('snakeFinalScore');

let snakeGame = null;
let snakeRecord = parseInt(localStorage.getItem('snakeRecord')) || 0;

function showSnakeScreen(screenId) {
    [snakeLoading, snakeIntro, snakeGameScreen, snakeGameOverScreen].forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function openSnakeGame() {
    snakeModal.classList.add('active');
    showSnakeScreen('snakeLoading');
    setTimeout(() => {
        showSnakeScreen('snakeIntro');
    }, 1200);
}

function startSnakeGame() {
    if (snakeGame) {
        snakeGame.stop();
        snakeGame = null;
    }
    showSnakeScreen('snakeGame');
    snakeGame = new SnakeGame(snakeCanvas, snakeScoreSpan);
    snakeGame.start();
}

function showGameOver(score) {
    showSnakeScreen('snakeGameOver');
    snakeFinalScoreSpan.textContent = score;
    if (score > snakeRecord) {
        snakeRecord = score;
        localStorage.setItem('snakeRecord', snakeRecord);
    }
}

function exitSnakeGame() {
    if (snakeGame) {
        snakeGame.stop();
        snakeGame = null;
    }
    snakeModal.classList.remove('active');
}

snakeStartBtn.addEventListener('click', startSnakeGame);
snakeRestartBtn.addEventListener('click', startSnakeGame);
snakeExitBtn.addEventListener('click', exitSnakeGame);
snakeClose.addEventListener('click', exitSnakeGame);

function playBeep(freq, duration, type = 'sine') {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0.15;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
        setTimeout(() => ctx.close(), duration * 1000 + 50);
    } catch (e) {
        console.error('Audio error:', e);
    }
}

class SnakeGame {
    constructor(canvas, scoreSpan) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scoreSpan = scoreSpan;
        this.gridSize = 15;
        this.cellSize = canvas.width / this.gridSize;
        this.snake = [{x: 7, y: 7}];
        this.food = {x: 10, y: 10};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameInterval = null;
        this.speed = 150;
        this.over = false;
        this.paused = false;
        this.boundKeyHandler = this.handleKey.bind(this);
        document.addEventListener('keydown', this.boundKeyHandler);
        this.draw();
    }

    handleKey(e) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'Space': 'space'
        };
        if (keyMap[e.key]) {
            e.preventDefault();
            const key = keyMap[e.key];
            if (key === 'space') {
                this.togglePause();
                return;
            }
            if (this.paused || this.over) return;
            if (
                (key === 'up' && this.direction !== 'down') ||
                (key === 'down' && this.direction !== 'up') ||
                (key === 'left' && this.direction !== 'right') ||
                (key === 'right' && this.direction !== 'left')
            ) {
                this.nextDirection = key;
            }
        }
    }

    togglePause() {
        if (this.over) return;
        this.paused = !this.paused;
        if (this.paused) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        } else {
            this.start();
        }
    }

    start() {
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.update(), this.speed);
        this.paused = false;
    }

    stop() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        document.removeEventListener('keydown', this.boundKeyHandler);
    }

    update() {
        if (this.paused || this.over) return;

        this.direction = this.nextDirection;
        const head = {...this.snake[0]};
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (
            head.x < 0 || head.x >= this.gridSize ||
            head.y < 0 || head.y >= this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            this.over = true;
            this.stop();
            playBeep(150, 0.3, 'sawtooth');
            showGameOver(this.score);
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.scoreSpan.textContent = this.score;
            playBeep(800, 0.1);
            this.placeFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    placeFood() {
        const freeCells = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!this.snake.some(seg => seg.x === i && seg.y === j)) {
                    freeCells.push({x: i, y: j});
                }
            }
        }
        const randomCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        this.food = randomCell;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
        this.ctx.fillStyle = '#1db954';
        this.snake.forEach((seg) => {
            this.ctx.fillRect(seg.x * this.cellSize, seg.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
        });
        this.ctx.fillStyle = '#ff3b30';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.cellSize + this.cellSize/2,
            this.food.y * this.cellSize + this.cellSize/2,
            this.cellSize/2 - 1,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
}

// ==========================================
// 11. МОБИЛЬНАЯ НАВИГАЦИЯ И ПРОГРЕСС
// ==========================================
const sectionNavBtn = document.getElementById('sectionNavBtn');
const sectionProgressBar = document.getElementById('sectionProgressBar');
let activeSection = null;
let isAnimating = false;

function getCurrentSection() {
    const viewportHeight = window.innerHeight;
    let current = null;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportHeight/2 && rect.bottom > viewportHeight/2) {
            current = section;
        }
    });
    return current;
}

function lockScrollToSection(section) {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const maxScroll = sectionBottom - window.innerHeight;
    const currentScroll = window.scrollY;

    if (currentScroll < sectionTop) {
        window.scrollTo({ top: sectionTop, behavior: 'auto' });
        return true;
    } else if (currentScroll > maxScroll && maxScroll > 0) {
        window.scrollTo({ top: maxScroll, behavior: 'auto' });
        return true;
    }
    return false;
}

function updateMobileNavigation() {
    if (!isMobile()) {
        sectionNavBtn.classList.remove('visible');
        sectionProgressBar.style.width = '0';
        return;
    }

    const section = getCurrentSection();
    if (!section) return;

    // Блокируем выход за пределы секции (если не анимация)
    if (!isAnimating) {
        lockScrollToSection(section);
    }

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollableHeight = sectionHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollableHeight)) : 0;
    sectionProgressBar.style.width = (progress * 100) + '%';

    const isAtBottom = scrollableHeight > 0 && window.scrollY + window.innerHeight >= sectionTop + sectionHeight - 5;
    const isAtTop = window.scrollY <= sectionTop + 5;

    if (isAtBottom && section.nextElementSibling && section.nextElementSibling.classList.contains('section')) {
        sectionNavBtn.textContent = '↓';
        sectionNavBtn.classList.add('visible');
        sectionNavBtn.onclick = () => {
            isAnimating = true;
            section.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { isAnimating = false; }, 1000);
        };
    } else if (isAtTop && section.previousElementSibling && section.previousElementSibling.classList.contains('section')) {
        sectionNavBtn.textContent = '↑';
        sectionNavBtn.classList.add('visible');
        sectionNavBtn.onclick = () => {
            isAnimating = true;
            section.previousElementSibling.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { isAnimating = false; }, 1000);
        };
    } else {
        sectionNavBtn.classList.remove('visible');
    }
}

if (isMobile()) {
    window.addEventListener('scroll', updateMobileNavigation);
    window.addEventListener('resize', updateMobileNavigation);
    updateMobileNavigation();
} else {
    sectionNavBtn.style.display = 'none';
    sectionProgressBar.style.display = 'none';
}

// ==========================================
// 12. МОДАЛЬНОЕ ОКНО ДЛЯ МУЗЫКИ (как было)
// ==========================================
const listenModal = document.getElementById('listenModal');
const modalSongTitle = document.getElementById('modalSongTitle');
const modalLinksContainer = document.getElementById('modalLinks');
const modalCloseBtn = document.getElementById('modalClose');

if (listenModal) {
    modalCloseBtn.addEventListener('click', () => {
        listenModal.classList.remove('active');
    });

    listenModal.addEventListener('click', (e) => {
        if (e.target === listenModal) {
            listenModal.classList.remove('active');
        }
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('listen-btn')) {
        const card = e.target.closest('.music-card');
        if (!card) return;

        const songInfo = card.querySelector('.song-info');
        const title = songInfo ? songInfo.textContent : 'Трек';

        const linksBlock = card.querySelector('.song-links');
        if (!linksBlock) return;

        modalLinksContainer.innerHTML = '';
        const links = linksBlock.querySelectorAll('a');
        if (links.length === 0) {
            modalLinksContainer.innerHTML = '<p>Ссылки не добавлены</p>';
        } else {
            links.forEach(link => {
                modalLinksContainer.appendChild(link.cloneNode(true));
            });
        }

        modalSongTitle.textContent = title;
        listenModal.classList.add('active');
    }
});

// ==========================================
// 13. МОДАЛЬНОЕ ОКНО ДОСТИЖЕНИЙ (как было)
// ==========================================
const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const statsModalClose = document.getElementById('statsModalClose');

statsBtn.addEventListener('click', () => {
    statsModal.classList.add('active');
    animateCounters();
});

statsModalClose.addEventListener('click', () => {
    statsModal.classList.remove('active');
    const counters = statsModal.querySelectorAll('.counter');
    counters.forEach(c => c.textContent = '0');
});

statsModal.addEventListener('click', (e) => {
    if (e.target === statsModal) {
        statsModal.classList.remove('active');
        const counters = statsModal.querySelectorAll('.counter');
        counters.forEach(c => c.textContent = '0');
    }
});

function animateCounters() {
    const counters = statsModal.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 1500;
        let startTime = null;

        function update(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * target);
            counter.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(update);
    });
}

// ==========================================
// 14. ИНДИКАТОР СЕКЦИЙ (десктоп)
// ==========================================
const indicatorDots = document.querySelectorAll('.dot');

if (!isMobile()) {
    function updateActiveDot(activeId) {
        indicatorDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.target === `#${activeId}`);
        });
    }

    const sectionIndicatorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveDot(entry.target.id);
            }
        });
    }, { threshold: 0.6 });

    sections.forEach(section => sectionIndicatorObserver.observe(section));

    indicatorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.dataset.target;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const snapContainer = document.querySelector('.snap-container');
                snapContainer.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// 15. КНОПКИ «ПОДРОБНЕЕ» В ТАЙМЛАЙНЕ (как было)
// ==========================================
document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        if (!content) return;
        content.classList.toggle('open');
        btn.textContent = content.classList.contains('open') ? 'Скрыть' : 'Подробнее';
    });
});

// ==========================================
// 16. ТОСТЫ
// ==========================================
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// 17. КОПИРОВАНИЕ EMAIL (как было)
// ==========================================
const copyEmailCard = document.getElementById('copyEmail');

if (copyEmailCard) {
    copyEmailCard.addEventListener('click', async () => {
        const emailSpan = copyEmailCard.querySelector('.email-address');
        if (!emailSpan) return;
        const email = emailSpan.textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email скопирован');
        } catch (err) {
            console.error('Не удалось скопировать:', err);
            showToast('Ошибка копирования');
        }
    });
}

// ==========================================
// 18. МОДАЛКА "ДРУГИЕ НАВЫКИ" (как было)
// ==========================================
const otherSkillsBtn = document.getElementById('otherSkillsBtn');
const otherSkillsModal = document.getElementById('otherSkillsModal');
const otherSkillsModalClose = document.getElementById('otherSkillsModalClose');

if (otherSkillsBtn && otherSkillsModal) {
    otherSkillsBtn.addEventListener('click', () => {
        otherSkillsModal.classList.add('active');
        setTimeout(() => {
            const fills = otherSkillsModal.querySelectorAll('.progress-fill');
            fills.forEach(fill => {
                const progress = fill.dataset.progress;
                fill.style.width = progress + '%';
            });
        }, 100);
    });

    otherSkillsModalClose.addEventListener('click', () => {
        otherSkillsModal.classList.remove('active');
        const fills = otherSkillsModal.querySelectorAll('.progress-fill');
        fills.forEach(fill => fill.style.width = '0');
    });

    otherSkillsModal.addEventListener('click', (e) => {
        if (e.target === otherSkillsModal) {
            otherSkillsModal.classList.remove('active');
            const fills = otherSkillsModal.querySelectorAll('.progress-fill');
            fills.forEach(fill => fill.style.width = '0');
        }
    });
}