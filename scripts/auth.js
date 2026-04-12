document.addEventListener('DOMContentLoaded', () => {
    initFormSwitching();
    initRoleToggle();
    initPasswordToggles();
    initLoginForm();
    initRegisterForm();
});

// вход и регистрация 
function initFormSwitching() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    document.querySelector('.switch-to-register')?.addEventListener('click', e => {
        e.preventDefault();
        loginForm?.classList.remove('active');
        registerForm?.classList.add('active');
    });
    document.querySelector('.switch-to-login')?.addEventListener('click', e => {
        e.preventDefault();
        registerForm?.classList.remove('active');
        loginForm?.classList.add('active');
    });
}

// пользователь и организация
function initRoleToggle() {
    const userBtn = document.querySelector('[data-role="user"]');
    const orgBtn = document.querySelector('[data-role="org"]');
    const userFields = document.querySelector('.user-fields');
    const orgFields = document.querySelector('.org-fields');
    const orgInnInput = document.querySelector('input[name="orgInn"]');

    if (!userBtn || !orgBtn || !userFields || !orgFields) return;

    userBtn.addEventListener('click', () => {
        userBtn.classList.add('active');
        orgBtn.classList.remove('active');
        userFields.classList.remove('hidden');
        orgFields.classList.add('hidden');
    });

    orgBtn.addEventListener('click', () => {
        orgBtn.classList.add('active');
        userBtn.classList.remove('active');
        orgFields.classList.remove('hidden');
        userFields.classList.add('hidden');
    });

    if (orgInnInput) {
        orgInnInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 12);
        });
    }
}

// глаз в пароле
function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.password-input-wrapper');
            const input = wrapper?.querySelector('input');
            const eyeOn = btn.querySelector('.eye-icon');
            const eyeOff = btn.querySelector('.eye-off-icon');

            if (!input || !eyeOn || !eyeOff) return;

            if (input.type === 'password') {
                input.type = 'text';
                eyeOn.classList.add('hidden');
                eyeOff.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOn.classList.remove('hidden');
                eyeOff.classList.add('hidden');
            }
        });
    });
}

// вход (временно)
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const email = form.querySelector('#loginInput')?.value || 'demo@user.ru';
        const user = {
            type: 'user',
            email: email,
            name: 'Пользователь',
            id: Date.now()
        };
        
        localStorage.setItem('ck_currentUser', JSON.stringify(user));
        
        alert('Вход выполнен!');
        window.location.href = 'index.html';
    });
}

// регистрация (времено)
function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const pass = form.querySelector('input[name="password"]')?.value;
        const passConf = form.querySelector('input[name="passwordConfirm"]')?.value;

        if (pass !== passConf) {
            alert('Пароли не совпадают');
            return;
        }
        
        alert('Регистрация успешна! Теперь можно войти.');
        form.reset();
        document.querySelector('.switch-to-login')?.click();
    });
}

// для доступа
window.isAuthenticated = () => !!localStorage.getItem('ck_currentUser');
window.getCurrentUser = () => {
    const user = localStorage.getItem('ck_currentUser');
    return user ? JSON.parse(user) : null;
};
window.logout = () => {
    localStorage.removeItem('ck_currentUser');
    window.location.href = 'index.html';
};