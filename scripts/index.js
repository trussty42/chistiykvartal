document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Подсветка активной ссылки
    setActiveLink();
    
    // 2. Бургер-меню
    initMobileMenu();
    
    // 3. Кнопки в hero
    initHeroButtons();
    
    // 4. "Читать полностью" в новостях
    initNewsToggle();
    
    // 5. Кнопка входа/профиля
    setTimeout(initAuthButton, 100);
});

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.js-nav-link').forEach(link => {
        link.classList.remove('header__menu-link_active');
        if (link.dataset.page === currentPage) {
            link.classList.add('header__menu-link_active');
        }
    });
}

function initMobileMenu() {
    const burger = document.querySelector('.header__burger');
    const navGroup = document.querySelector('.header__nav-group');
    const body = document.body;

    if (!burger || !navGroup) return;

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navGroup.classList.toggle('open');
        body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.header__menu-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navGroup.classList.remove('open');
            body.classList.remove('menu-open');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header__nav-group') && 
            !e.target.closest('.header__burger') &&
            navGroup.classList.contains('open')) {
            burger.classList.remove('active');
            navGroup.classList.remove('open');
            body.classList.remove('menu-open');
        }
    });
}

function initHeroButtons() {
    const catalogBtn = document.querySelector('.hero__button-catalog');
    const mapBtn = document.querySelector('.hero__button-map');
    
    if (catalogBtn) {
        catalogBtn.addEventListener('click', () => window.location.href = 'catalog.html');
    }
    if (mapBtn) {
        mapBtn.addEventListener('click', () => window.location.href = 'map.html');
    }
}

function initNewsToggle() {
    document.querySelectorAll('.button__read-more').forEach(button => {
        button.addEventListener('click', function() {
            const newsItem = this.closest('.news-card');
            const newsFull = newsItem?.querySelector('.news-card__full');
            const btnText = this.querySelector('.button__text');
            
            if (!newsFull || !btnText) return;
            
            const isExpanded = newsFull.classList.contains('active');
            newsFull.classList.toggle('active');
            this.classList.toggle('expanded');
            btnText.textContent = isExpanded ? 'Читать полностью' : 'Свернуть';
            
            if (!isExpanded) {
                newsItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

function initAuthButton() {
    const btn = document.getElementById('authButton');
    if (!btn) return;
    
    const currentUser = localStorage.getItem('ck_currentUser');
    
    if (currentUser) {
        btn.className = 'header__button-login profile-mode';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        btn.onclick = (e) => { e.preventDefault(); window.location.href = 'dashboard.html'; };
    } else {
        btn.className = 'header__button-login';
        btn.textContent = 'Вход';
        btn.onclick = (e) => { e.preventDefault(); window.location.href = 'profile.html'; };
    }
}
 