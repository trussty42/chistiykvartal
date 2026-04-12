// Данные каталога (API)
const catalogData = [
    { id: 1, name: "Книга", category: "Бумага и картон", type: "paper", price: 34, image: "book.svg" },
    { id: 2, name: "Пластиковые стаканы", category: "Пластик", type: "plastic", price: 5, image: "cups.svg" },
    { id: 3, name: "Газета", category: "Бумага и картон", type: "paper", price: 11, image: "newspaper.svg" },
    { id: 4, name: "Пластиковый пакет", category: "Пластик", type: "plastic", price: 10, image: "bag.svg" },
    { id: 5, name: "Пластиковая труба", category: "Пластик", type: "plastic", price: 50, image: "pipe.svg" },
    { id: 6, name: "Бумажный пакет", category: "Бумага и картон", type: "paper", price: 2, image: "paper-bag.svg" },
    { id: 7, name: "Пластиковая бутылка", category: "Пластик", type: "plastic", price: 22, image: "bottle.svg" },
    { id: 8, name: "Бумага", category: "Бумага и картон", type: "paper", price: 39, image: "paper.svg" },
    { id: 9, name: "Коробка для яиц", category: "Бумага и картон", type: "paper", price: 20, image: "egg-carton.svg" },
    { id: 10, name: "Стеклянная бутылка", category: "Стекло", type: "glass", price: 15, image: "glass-bottle.svg" },
    { id: 11, name: "Алюминиевая банка", category: "Металл", type: "metal", price: 45, image: "can.svg" },
    { id: 12, name: "Картон", category: "Бумага и картон", type: "paper", price: 28, image: "cardboard.svg" },
    { id: 13, name: "Пластиковое ведро", category: "Пластик", type: "plastic", price: 18, image: "bucket.svg" },
    { id: 14, name: "Стеклянная банка", category: "Стекло", type: "glass", price: 12, image: "jar.svg" },
    { id: 15, name: "Металлическая крышка", category: "Металл", type: "metal", price: 35, image: "lid.svg" },
    { id: 16, name: "Журнал", category: "Бумага и картон", type: "paper", price: 30, image: "magazine.svg" },
    { id: 17, name: "Пластиковая канистра", category: "Пластик", type: "plastic", price: 25, image: "canister.svg" },
    { id: 18, name: "Гофрокартон", category: "Бумага и картон", type: "paper", price: 32, image: "corrugated.svg" },
    { id: 19, name: "Стеклянная бутылка (темная)", category: "Стекло", type: "glass", price: 16, image: "dark-bottle.svg" },
    { id: 20, name: "Пластиковый контейнер", category: "Пластик", type: "plastic", price: 20, image: "container.svg" },
    { id: 21, name: "Медная проволока", category: "Металл", type: "metal", price: 350, image: "wire.svg" },
    { id: 22, name: "Бумажный стакан", category: "Бумага и картон", type: "paper", price: 8, image: "paper-cup.svg" },
    { id: 23, name: "Пластиковая пленка", category: "Пластик", type: "plastic", price: 15, image: "film.svg" },
    { id: 24, name: "Алюминиевая фольга", category: "Металл", type: "metal", price: 60, image: "foil.svg" },
    { id: 25, name: "Картонная коробка", category: "Бумага и картон", type: "paper", price: 26, image: "box.svg" },
    { id: 26, name: "Пластиковая крышка", category: "Пластик", type: "plastic", price: 12, image: "plastic-lid.svg" },
    { id: 27, name: "Стеклянный стакан", category: "Стекло", type: "glass", price: 14, image: "glass-cup.svg" },
    { id: 28, name: "Стальная банка", category: "Металл", type: "metal", price: 40, image: "steel-can.svg" }
];

let filteredData = [...catalogData];
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    initFilters();
    initSearch();
    initSort();
    initPagination();
});

function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filteredData.slice(start, end);
    
    if (items.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #888;">Ничего не найдено</div>';
    } else {
        grid.innerHTML = items.map(item => `
            <div class="catalog-item" onclick="showItemDetails(${item.id})">
                <div class="item-image">
                    <img src="./images/catalog/${item.image}" 
                        alt="${item.name}" 
                        onerror="this.src='./images/noimg.svg'">
                </div>
                <h3 class="item-name">${item.name}</h3>
                <p class="item-category">${item.category}</p>
                <div class="item-price">${item.price} руб/кг</div>
                <div class="item-arrow">
                    <img src="./images/arrow.svg" alt="Подробнее" />
                </div>
            </div>
        `).join('');
    }
    
    const countEl = document.querySelector('.found-count strong');
    if (countEl) {
        countEl.textContent = filteredData.length;
    }
}

function initFilters() {
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function applyFilters() {
    const checkedTypes = Array.from(document.querySelectorAll('.checkbox-item input:checked'))
        .map(input => {
            const label = input.closest('.checkbox-item');
            if (label.textContent.includes('Пластик')) return 'plastic';
            if (label.textContent.includes('Стекло')) return 'glass';
            if (label.textContent.includes('Электроника')) return 'electronic';
            if (label.textContent.includes('Металл')) return 'metal';
            if (label.textContent.includes('Бумага')) return 'paper';
            if (label.textContent.includes('Мебель и крупногабарит')) return 'furniture';
            if (label.textContent.includes('Текстиль')) return 'textile';
            if (label.textContent.includes('Батарейки')) return 'battery';
            if (label.textContent.includes('Строительный мусор')) return 'construction';
            if (label.textContent.includes('Дерево')) return 'tree';
            if (label.textContent.includes('Автошины')) return 'tire';
            if (label.textContent.includes('Лампочки')) return 'bulb';
            return null;
        })
        .filter(Boolean);
    
    const priceInputs = document.querySelectorAll('.price-input');
    const priceFrom = parseFloat(priceInputs[0]?.value) || 0;
    const priceTo = parseFloat(priceInputs[1]?.value) || Infinity;
    
    filteredData = catalogData.filter(item => {
        const typeMatch = checkedTypes.length === 0 || checkedTypes.includes(item.type);
        const priceMatch = item.price >= priceFrom && item.price <= priceTo;
        return typeMatch && priceMatch;
    });
    
    currentPage = 1;
    renderCatalog();
    initPagination();
}

function resetFilters() {
    document.querySelectorAll('.checkbox-item input').forEach(input => {
        input.checked = false;
    });
    
    document.querySelectorAll('.price-input').forEach(input => {
        input.value = '';
    });
    
    filteredData = [...catalogData];
    currentPage = 1;
    renderCatalog();
    initPagination();
}

function initSearch() {
    const searchInput = document.querySelector('.search-input-wrapper input');
    if (!searchInput) return;
    
    let timeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            filteredData = catalogData.filter(item => 
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
            
            currentPage = 1;
            renderCatalog();
            initPagination();
        }, 300);
    });
}

function initSort() {
    const sortSelect = document.querySelector('.catalog-header-info .sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', (e) => {
        const sort = e.target.value;
        
        switch(sort) {
            case 'name-asc':
                filteredData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredData.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                filteredData.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredData.sort((a, b) => b.price - a.price);
                break;
            default:
                filteredData.sort((a, b) => a.id - b.id);
        }
        
        renderCatalog();
    });
}

function initPagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="page-btn" onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}><img src="./images/left.svg"/></button>
        <span style="color: #666; font-size: 14px;">Страница ${currentPage} из ${totalPages}</span>
        <button class="page-btn" onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''}><img src="./images/right.svg"/></button>
    `;
    
    pagination.innerHTML = html;
}

function changePage(delta) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const newPage = currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderCatalog();
        initPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showItemDetails(id) {
    const item = catalogData.find(i => i.id === id);
    if (!item) return;
    
    alert(`
        ${item.name}
        
        Категория: ${item.category}
        Цена: ${item.price} руб/кг
        Тип: ${item.type}
        
        (Здесь будет модальное окно с подробной информацией)
    `);
}

window.showItemDetails = showItemDetails;
window.changePage = changePage;