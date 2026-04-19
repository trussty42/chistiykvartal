let currentView = 'map';
let allPoints = [
    {
        id: 1,
        coords: [56.837435, 60.597636],
        name: 'ЭкоПункт',
        address: 'ул. Куйбышева, 21',
        phone: '+7 (495) 123-45-67',
        hours: 'Пн-Пт: 9:00-18:00',
        types: ['Пластик', 'Бумага', 'Стекло', 'Металл'],
        rating: 4.8,
        reviews: 12,
        isOpenNow: true,
        is24hours: false
    },
    {
        id: 2,
        coords: [56.836766, 60.657949],
        name: 'ЭкоЛогия',
        address: 'ул. Коминтерна, 11',
        phone: '+7 (495) 987-65-43',
        hours: 'Ежедневно: 10:00-20:00',
        types: ['Пластик', 'Бумага', 'Текстиль'],
        rating: 4.5,
        reviews: 8,
        isOpenNow: true,
        is24hours: false
    }
];
let filteredPoints = [...allPoints];

// ===== ПОЛУЧЕНИЕ КООРДИНАТ ПОЛЬЗОВАТЕЛЯ (ГЛОБАЛЬНО) =====
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                window.userCoordinates = [
                    position.coords.latitude,
                    position.coords.longitude
                ];
                console.log('Координаты пользователя:', window.userCoordinates);
            },
            (error) => {
                console.warn('Не удалось получить координаты:', error);
            }
        );
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    if (typeof ymaps === 'undefined') {
        console.error('Яндекс.Карты API не загружен');
        return;
    }
    
    ymaps.ready(() => {
        initMap();
        initViewToggle();
        initFilters();
        initSearch();
        initSort(); // Инициализируем сортировку
        renderList();
    });
    
    // Вызываем получение геолокации
    getUserLocation();
});

// ===== КАРТА =====
function initMap() {
    try {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Контейнер #map не найден');
            return;
        }
        
        window.yandexMap = new ymaps.Map(mapElement, {
            center: [56.837435, 60.597636],
            zoom: 13,
            controls: ['zoomControl', 'geolocationControl']
        });
        
        filteredPoints.forEach(point => {
            addMarker(
                window.yandexMap, 
                point.coords, 
                point.name, 
                point.address,
                point.phone,
                point.hours,
                point.types,
                point.rating,
                point.reviews,
                point.isOpenNow,
                point.id //Подробнее
            );
        });
        
        if (filteredPoints.length > 1) {
            window.yandexMap.setBounds(window.yandexMap.geoObjects.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 50
            });
        }
        
        console.log('Карта загружена');
        
    } catch (error) {
        console.error('Ошибка карты:', error);
    }
}

function addMarker(map, coords, name, address, phone, hours, types, rating, reviews, isOpenNow, id) {
    const placemark = new ymaps.Placemark(coords, {
        balloonContent: `
            <div class="map-balloon">
                <button class="balloon-close" onclick="closeBalloon()" aria-label="Закрыть">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="balloon-header">
                    <h3 class="balloon-title">${name}</h3>
                    ${rating ? `
                        <div class="balloon-rating">
                            <span class="star">★</span>
                            <span class="rating-value">${rating}</span>
                            <span class="rating-count">${reviews} оценок</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="balloon-body">
                    <p class="balloon-address">${address}</p>
                    
                    ${hours ? `<p class="balloon-hours">${hours}</p>` : ''}
                </div>
                
                <div class="balloon-footer">
                    <span class="status-badge ${isOpenNow ? 'status-open' : 'status-closed'}">
                        ${isOpenNow ? 'открыто' : 'закрыто'}
                    </span>
                    <button class="balloon-btn" onclick="openPointModal(${id})">
                        <img src="./images/arrow.svg" alt="Подробнее" onerror="this.style.display='none'"/>
                    </button>
                </div>
            </div>
        `,
        hintContent: `${name} — ${address}`
    }, {
        preset: 'islands#greenRecyclingIcon',
        iconColor: '#609432',
        alloonMaxWidth: 300, // Ограничиваем максимальную ширину
        balloonMinWidth: 300, // Фиксируем ширину
        balloonCloseButton: false,
        balloonPanelMaxMapArea: 0 // Отключаем панель
    });
    
    map.geoObjects.add(placemark);
}

function initViewToggle() {
    const viewRadios = document.querySelectorAll('.view-switcher input[type="radio"]');
    const mapView = document.getElementById('mapView');
    const listView = document.getElementById('listView');
    
    viewRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const view = radio.value;
            currentView = view;
            
            if (view === 'map') {
                mapView?.classList.add('active');
                listView?.classList.remove('active');
            } else {
                mapView?.classList.remove('active');
                listView?.classList.add('active');
                renderList();
            }
        });
    });
}

// ===== ОТРИСОВКА СПИСКА =====
function renderList() {
    const listContent = document.getElementById('listContent');
    const foundCount = document.querySelector('.found-count strong');
    
    if (!listContent) return;
    if (foundCount) foundCount.textContent = filteredPoints.length;
    
    if (filteredPoints.length === 0) {
        listContent.innerHTML = '<p style="text-align:center;padding:40px;color:#888">Ничего не найдено</p>';
        return;
    }
    
    listContent.innerHTML = filteredPoints.map(point => `
        <div class="collection-point-card" onclick="window.openPointModal(${point.id})">
            <div class="card-header">
                <h3 class="card-title">${point.name}</h3>
                ${point.rating ? `
                    <div class="card-rating">
                        <span class="star">★</span>
                        <span class="rating-value">${point.rating}</span>
                        <span class="rating-count">${point.reviews} оценок</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="card-body">
                <div class="card-info-item">
                    <span class="info-text">${point.address}</span>
                </div>
                
                ${point.hours ? `
                    <div class="card-info-item">
                        <span class="info-text">${point.hours}</span>
                    </div>
                ` : ''}
                
            </div>
            
            <div class="card-footer">
                <span class="status-badge ${point.isOpenNow ? 'status-open' : 'status-closed'}">
                    ${point.isOpenNow ? 'открыто' : 'закрыто'}
                </span>
                <button class="card-btn" onclick="window.openPointModal(${point.id})">
                    Подробнее
                </button>
            </div>
        </div>
    `).join('');
}

// ===== ПОИСК =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let timeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            filteredPoints = allPoints.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.address.toLowerCase().includes(query)
            );
            
            updateFoundCount();
            
            if (currentView === 'list') {
                renderList();
            } else {
                if (window.yandexMap) {
                    window.yandexMap.geoObjects.removeAll();
                    filteredPoints.forEach(p => {
                        addMarker(window.yandexMap, p.coords, p.name, p.address, p.phone, p.hours, p.types);
                    });
                    if (filteredPoints.length > 1) {
                        window.yandexMap.setBounds(window.yandexMap.geoObjects.getBounds(), {
                            checkZoomRange: true,
                            zoomMargin: 50
                        });
                    }
                }
            }
        }, 300);
    });
}

// ===== СОРТИРОВКА ✅ =====
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', (e) => {
        sortPoints(e.target.value);
    });
}

function sortPoints(type) {
    filteredPoints.sort((a, b) => {
        switch (type) {
            case 'name-asc':
                return a.name.localeCompare(b.name, 'ru');
            case 'name-desc':
                return b.name.localeCompare(a.name, 'ru');
            case 'rating':
                return b.rating - a.rating;
            case 'distance':
                if (window.userCoordinates && a.coords && b.coords) {
                    const distA = calculateDistance(window.userCoordinates, a.coords);
                    const distB = calculateDistance(window.userCoordinates, b.coords);
                    return distA - distB;
                }
                return 0;
            default:
                return a.id - b.id;
        }
    });
    
    if (currentView === 'list') {
        renderList();
    }
    // На карте сортировка не влияет на отображение, но массив обновляется
}

// ===== ФОРМУЛА РАССТОЯНИЯ (Haversine) =====
function calculateDistance(coords1, coords2) {
    if (!coords1 || !coords2) return Infinity;
    const R = 6371;
    const lat1 = coords1[0] * Math.PI / 180;
    const lat2 = coords2[0] * Math.PI / 180;
    const deltaLat = (coords2[0] - coords1[0]) * Math.PI / 180;
    const deltaLon = (coords2[1] - coords1[1]) * Math.PI / 180;
    
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
}

// ===== ПОДСВЕТКА СЛАЙДЕРА =====
function updateSliderBackground(slider) {
    const min = slider.min ? parseFloat(slider.min) : 0;
    const max = slider.max ? parseFloat(slider.max) : 100;
    const val = slider.value;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #609432 ${percentage}%, #e0e0e0 ${percentage}%)`;
}

// ===== ФИЛЬТРЫ =====
function initFilters() {
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    // Слайдер рейтинга
    const ratingRange = document.getElementById('ratingRange');
    const ratingValue = document.getElementById('ratingValue');
    if (ratingRange && ratingValue) {
        ratingRange.addEventListener('input', () => {
            ratingValue.textContent = ratingRange.value;
            updateSliderBackground(ratingRange);
        });
        updateSliderBackground(ratingRange);
    }
    
    // Слайдер радиуса
    const radiusRange = document.getElementById('radiusRange');
    const radiusValue = document.getElementById('radiusValue');
    if (radiusRange && radiusValue) {
        radiusRange.addEventListener('input', () => {
            radiusValue.textContent = radiusRange.value;
            updateSliderBackground(radiusRange);
        });
        updateSliderBackground(radiusRange);
    }
    
    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    
    // ===== ВЫБОР ВРЕМЕНИ =====
    const customTimeRadio = document.getElementById('customTimeRadio');
    const customTimePicker = document.getElementById('customTimePicker');
    const customDate = document.getElementById('customDate');
    const timeFrom = document.getElementById('timeFrom');
    const timeTo = document.getElementById('timeTo');
    
    if (customDate) {
        const today = new Date().toISOString().split('T')[0];
        customDate.value = today;
        customDate.min = today;
    }
    
    if (customTimeRadio && customTimePicker) {
        customTimeRadio.addEventListener('change', () => {
            if (customTimeRadio.checked) {
                customTimePicker.style.display = 'block';
                setTimeout(() => customDate?.focus(), 100);
            } else {
                customTimePicker.style.display = 'none';
            }
        });
    }
    
    document.querySelectorAll('input[name="hours"]').forEach(radio => {
        if (radio !== customTimeRadio) {
            radio.addEventListener('change', () => {
                if (customTimePicker) customTimePicker.style.display = 'none';
            });
        }
    });
    
    if (timeFrom && timeTo) {
        timeFrom.addEventListener('change', () => {
            if (timeTo.value && timeFrom.value > timeTo.value) {
                timeTo.value = timeFrom.value;
                alert('Время окончания не может быть раньше времени начала!');
            }
        });
        timeTo.addEventListener('change', () => {
            if (timeFrom.value && timeTo.value < timeFrom.value) {
                timeFrom.value = timeTo.value;
                alert('Время начала не может быть позже времени окончания!');
            }
        });
    }
    
    // ===== МОБИЛЬНОЕ МЕНЮ =====
    const filtersToggle = document.getElementById('filtersToggle');
    const filtersClose = document.getElementById('filtersClose');
    const filtersSidebar = document.getElementById('filtersSidebar');
    
    if (filtersToggle && filtersSidebar) {
        filtersToggle.addEventListener('click', () => filtersSidebar.classList.add('open'));
    }
    if (filtersClose && filtersSidebar) {
        filtersClose.addEventListener('click', () => filtersSidebar.classList.remove('open'));
    }
    if (filtersSidebar) {
        filtersSidebar.addEventListener('click', (e) => {
            if (e.target === filtersSidebar) filtersSidebar.classList.remove('open');
        });
    }
}

function applyFilters() {
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
        .map(i => i.value);
    const minRating = parseFloat(document.getElementById('ratingRange')?.value) || 0;
    const maxRadius = parseFloat(document.getElementById('radiusRange')?.value) || 50;
    
    // ✅ Используем глобальные координаты
    const userCoords = window.userCoordinates || null;
    
    filteredPoints = allPoints.filter(p => {
        const typeMatch = checkedTypes.length === 0 || 
            checkedTypes.some(t => p.types.some(pt => pt.toLowerCase().includes(t)));
        const ratingMatch = p.rating >= minRating;
        
        let radiusMatch = true;
        if (userCoords && p.coords) {
            const distance = calculateDistance(userCoords, p.coords);
            radiusMatch = distance <= maxRadius;
        }
        
        return typeMatch && ratingMatch && radiusMatch;
    });
    
    updateFoundCount();
    
    if (currentView === 'list') {
        renderList();
    } else {
        if (window.yandexMap) {
            window.yandexMap.geoObjects.removeAll();
            filteredPoints.forEach(p => {
                addMarker(window.yandexMap, p.coords, p.name, p.address, p.phone, p.hours, p.types);
            });
            if (filteredPoints.length > 1) {
                window.yandexMap.setBounds(window.yandexMap.geoObjects.getBounds(), {
                    checkZoomRange: true,
                    zoomMargin: 50
                });
            }
        }
    }
    
    document.getElementById('filtersSidebar')?.classList.remove('open');
}

function resetFilters() {
    // Сбрасываем чекбоксы
    document.querySelectorAll('input[name="type"]').forEach(cb => cb.checked = false);
    
    // Сбрасываем рейтинг
    const ratingRange = document.getElementById('ratingRange');
    const ratingValue = document.getElementById('ratingValue');
    if (ratingRange) { ratingRange.value = 0; }
    if (ratingValue) { ratingValue.textContent = '0'; updateSliderBackground(ratingRange); }
    
    // Отмечаем "открыто сейчас"
    document.querySelectorAll('input[name="hours"]').forEach(radio => {
        radio.checked = (radio.value === 'now');
    });
    
    // Скрываем кастомное время
    const customTimePicker = document.getElementById('customTimePicker');
    if (customTimePicker) customTimePicker.style.display = 'none';
    
    // Сбрасываем радиус
    const radiusRange = document.getElementById('radiusRange');
    const radiusValue = document.getElementById('radiusValue');
    if (radiusRange) { radiusRange.value = 0; }
    if (radiusValue) { radiusValue.textContent = '0'; updateSliderBackground(radiusRange); }
    
    // Возвращаем все пункты
    filteredPoints = [...allPoints];
    
    updateFoundCount();
    
    if (currentView === 'list') {
        renderList();
    } else {
        if (window.yandexMap) {
            window.yandexMap.geoObjects.removeAll();
            filteredPoints.forEach(p => {
                addMarker(window.yandexMap, p.coords, p.name, p.address, p.phone, p.hours, p.types);
            });
        }
    }
    
    document.getElementById('filtersSidebar')?.classList.remove('open');
    console.log('✅ Сброс завершён');
}

function updateFoundCount() {
    const foundCountEl = document.querySelector('.found-count strong');
    if (foundCountEl) foundCountEl.textContent = filteredPoints.length;
}

// для открытия модального окна из баллона
window.openPointModal = function(id) {
    const point = allPoints.find(p => p.id === id);
    if (point) {
        alert(`${point.name}\n${point.address}\n\nЗдесь можно открыть модальное окно с деталями`);
        // Или вызови свою функцию открытия модалки
    }
};

// для закрытия любого открытого баллона
window.closeBalloon = function() {
    if (window.yandexMap) {
        window.yandexMap.geoObjects.each(function (obj) {
            if (obj.balloon && obj.balloon.isOpen()) {
                obj.balloon.close();
            }
        });
    }
};