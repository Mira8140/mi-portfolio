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
// 3. АНИМИРОВАННЫЙ ТЕКСТ
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
// 4. ТАБЫ
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
// 5. УПРАВЛЕНИЕ СЕКЦИЯМИ (только десктоп)
// ==========================================
const sections = document.querySelectorAll('.section');
let activeSectionId = null;

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

function updateActiveSection() {
    const snapContainer = document.querySelector('.snap-container');
    const scrollTop = snapContainer.scrollTop;
    const containerHeight = snapContainer.clientHeight;

    let newActiveSection = null;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollTop >= sectionTop - containerHeight * 0.5 && scrollTop < sectionBottom - containerHeight * 0.5) {
            newActiveSection = section;
        }
    });

    if (!newActiveSection) {
        newActiveSection = sections[sections.length - 1];
    }

    if (newActiveSection && newActiveSection.id !== activeSectionId) {
        activeSectionId = newActiveSection.id;

        sections.forEach(section => {
            section.classList.remove('visible');
        });

        newActiveSection.classList.add('visible');

        restartStaggerAnimations(newActiveSection);

        if (newActiveSection.id === 'skills') {
            restartProgressBars(newActiveSection);
        }
    }
}

if (!isMobile()) {
    const snapContainer = document.querySelector('.snap-container');
    snapContainer.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveSection);
    });
    window.addEventListener('DOMContentLoaded', updateActiveSection);
} else {
    // На мобильных все секции видимы сразу
    sections.forEach(section => section.classList.add('visible'));
    // Заполняем прогресс-бары навыков
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        restartProgressBars(skillsSection);
    }
}

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
// 9. КНОПКА ЧЕЛОВЕКА-ПАУКА И ЦИТАТА
// ==========================================
const spiderBtn = document.getElementById('spiderBtn');
const spiderQuote = document.getElementById('spiderQuote');

if (spiderBtn) {
    spiderBtn.addEventListener('click', () => {
        if (!body.classList.contains('dark')) {
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }

        if (isMobile()) {
            // На мобильных показываем тост
            showToast('С великой силой приходит великая ответственность!');
        } else if (spiderQuote) {
            // На десктопе анимация
            spiderQuote.classList.remove('show');
            void spiderQuote.offsetWidth;
            spiderQuote.classList.add('show');
        }
    });
}

// ==========================================
// 10. СЕКРЕТНАЯ ПАСХАЛКА (только десктоп)
// ==========================================
let spiderClickCount = 0;
let snakeGame = null;

if (spiderBtn && !isMobile()) {
    spiderBtn.addEventListener('click', () => {
        spiderClickCount++;
        if (spiderClickCount >= 5) {
            spiderClickCount = 0;
            openSnakeGame();
        }
    });
}

function openSnakeGame() {
    const modal = document.getElementById('snakeModal');
    const canvas = document.getElementById('snakeCanvas');
    const scoreSpan = document.getElementById('snakeScore');
    const closeBtn = document.getElementById('snakeClose');

    modal.classList.add('active');
    closeBtn.onclick = () => {
        modal.classList.remove('active');
        if (snakeGame) {
            snakeGame.stop();
            snakeGame = null;
        }
    };

    if (!snakeGame) {
        snakeGame = new SnakeGame(canvas, scoreSpan);
    }
    snakeGame.start();
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
        this.boundKeyHandler = this.handleKey.bind(this);
        document.addEventListener('keydown', this.boundKeyHandler);
    }

    handleKey(e) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        if (keyMap[e.key]) {
            e.preventDefault();
            const newDir = keyMap[e.key];
            if (
                (newDir === 'up' && this.direction !== 'down') ||
                (newDir === 'down' && this.direction !== 'up') ||
                (newDir === 'left' && this.direction !== 'right') ||
                (newDir === 'right' && this.direction !== 'left')
            ) {
                this.nextDirection = newDir;
            }
        }
    }

    start() {
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.update(), this.speed);
    }

    stop() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        document.removeEventListener('keydown', this.boundKeyHandler);
    }

    update() {
        if (this.over) return;

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
            alert('Игра окончена! Счёт: ' + this.score);
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.scoreSpan.textContent = this.score;
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
        this.ctx.fillStyle = '#1db954';
        this.snake.forEach((seg) => {
            this.ctx.fillRect(seg.x * this.cellSize, seg.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
        });
        this.ctx.fillStyle = '#ff3b30';
        this.ctx.fillRect(this.food.x * this.cellSize, this.food.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
    }
}

// ==========================================
// 11. МОДАЛЬНОЕ ОКНО ДЛЯ МУЗЫКИ
// ==========================================
const listenModal = document.getElementById('listenModal');
const modalSongTitle = document.getElementById('modalSongTitle');
const modalLinksContainer = document.getElementById('modalLinks');
const modalClose = document.getElementById('modalClose');

if (listenModal) {
    modalClose.addEventListener('click', () => {
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
// 12. МОДАЛЬНОЕ ОКНО ДОСТИЖЕНИЙ
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
// 13. ИНДИКАТОР СЕКЦИЙ (только десктоп)
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
// 14. КНОПКИ «ПОДРОБНЕЕ» В ТАЙМЛАЙНЕ
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
// 15. ТОСТЫ
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
// 16. КОПИРОВАНИЕ EMAIL
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
// 17. МОДАЛКА "ДРУГИЕ НАВЫКИ"
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