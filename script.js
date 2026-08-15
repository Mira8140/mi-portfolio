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
// 2. 3D-ЭФФЕКТ ДЛЯ КАРТОЧКИ HERO
// ==========================================
const heroCard = document.getElementById('heroCard');

if (heroCard) {
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
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
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
            const snapContainer = document.querySelector('.snap-container');
            const offsetTop = targetElement.offsetTop;
            snapContainer.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 7. КНОПКА «НАВЕРХ»
// ==========================================
const backToTopBtn = document.getElementById('backToTop');
const snapContainer = document.querySelector('.snap-container');

function toggleBackToTop() {
    if (snapContainer.scrollTop > window.innerHeight * 0.5) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

snapContainer.addEventListener('scroll', toggleBackToTop);

backToTopBtn.addEventListener('click', () => {
    snapContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// 8. PRELOADER (скрываем через 0.8 сек)
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

if (spiderBtn && spiderQuote) {
    spiderBtn.addEventListener('click', () => {
        // Включаем тёмную тему, если она ещё не включена
        if (!body.classList.contains('dark')) {
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        // Перезапускаем анимацию фразы
        spiderQuote.classList.remove('show');
        void spiderQuote.offsetWidth; // форсируем reflow
        spiderQuote.classList.add('show');
    });
}

// ==========================================
// 10. СЕКРЕТНАЯ ПАСХАЛКА «ЗМЕЙКА»
// ==========================================
let spiderClickCount = 0;
let snakeGame = null;

if (spiderBtn) {
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

// Класс игры «Змейка»
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

// Делегирование кликов по кнопкам «Слушать»
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
// 12. АНИМИРОВАННЫЕ СЧЁТЧИКИ
// ==========================================
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            const duration = 1500;
            let startTime = null;

            function updateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const current = Math.floor(progress * target);
                counter.textContent = current;
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));