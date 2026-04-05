let formMode = 'register';

const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', submitForm);

const registerMessage = document.getElementById('registerFormMessage');


async function fetchData () {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/test/");
    
        if (!res.ok) throw new Error();
    
        const data = await res.json();

        console.log(data?.message);
    }
    catch (err) {
        console.log(`An error has occurred: ${err}`)
    }
}

function submitForm (event) {
    if (formMode === 'register') {register(event)}
    else {login(event)}
}

async function register (event) {
    event.preventDefault();
    try {
        let username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        if (!username || !password) {
            showMessage(registerMessage, 'Please fill all fields', 'error');
            return;
        }
        else if (username.includes(' ') || password.includes(' ')) {
            showMessage(registerMessage, 'Username & Password cannot contain spaces', 'error');
            return;
        }

        username = username.toLowerCase();
    
        const res = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        let data = null;
        try {
            data = await res.json();
        }
        catch {
            data = {error: 'No reponse from server'}
        }

        if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    
        showMessage(registerMessage, data.message, 'success');
    }
    catch (err) {
        showMessage(registerMessage, err.message, 'error');
    }
}

async function login (event) {
    event.preventDefault();
    try {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        if (!username || !password) {
            showMessage(registerMessage, 'Please fill all fields', 'error');
            return;
        }
        else if (username.includes(' ') || password.includes(' ')) {
            showMessage(registerMessage, 'Username & Password cannot contain spaces', 'error');
            return;
        }
    
        const res = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        let data = null;
        try {
            data = await res.json();
        }
        catch {
            data = {error: 'No reponse from server'}
        }

        if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    
        showMessage(registerMessage, data.message, 'success');
    }
    catch (err) {
        showMessage(registerMessage, err.message, 'error');
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.classList.remove('opacity-0');
    element.classList.add('opacity-100');
    element.classList.add('translate-y-2');

    element.classList.remove('text-red-400', 'text-green-400');

    if (type === 'error') {
        element.classList.add('text-red-400');
    }
    else {
        element.classList.add('text-green-400');
    }

    if (element._timeout) clearTimeout(element._timeout);

    element._timeout = setTimeout(() => {
        element.classList.add('opacity-0');
        element.classList.remove('opacity-100');
        element.classList.remove('translate-y-2');
    }, 3000);
}

const moveToRegister = document.getElementById('moveToRegister');
const moveToLogin = document.getElementById('moveToLogin');

moveToRegister?.addEventListener('click',() => {moveToButtonClick('register')});
moveToLogin?.addEventListener('click',() => {moveToButtonClick('login')});

function moveToButtonClick (moveTo) {
    if (moveTo !== 'register' && moveTo !== 'login') return;

    registerForm.reset();

    if (moveTo === 'register') {
        formMode = 'register';
        moveToLogin.classList.add('opacity-50');
        moveToRegister.classList.add('scale-105');
        moveToRegister.classList.remove('opacity-50');
        moveToLogin.classList.remove('scale-105');
    }
    else {
        formMode = 'login';
        moveToRegister.classList.add('opacity-50');
        moveToLogin.classList.add('scale-105');
        moveToLogin.classList.remove('opacity-50');
        moveToRegister.classList.remove('scale-105');
    }
}