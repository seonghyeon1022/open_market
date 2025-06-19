import { ENDPOINT } from './api/config.js';

const loginForm = document.querySelector('.login__form');
const idInput = document.getElementById('id');
const pwInput = document.getElementById('pw');
const errorMessage = document.getElementById('loginError');
const tabItems = document.querySelectorAll('.login__tab-item');

let currentUserType = 'BUYER';

tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        tabItems.forEach(t => t.classList.remove('active'));

        tab.classList.add('active');

        currentUserType = index === 0 ? 'BUYER' : 'SELLER';

        idInput.value = '';
        pwInput.value = '';
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');
    });
});

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const idValue = idInput.value.trim();
    const pwValue = pwInput.value.trim();
    let message = '';

    if (!idValue) {
        message = '아이디를 입력해 주세요.';
    } else if (!pwValue) {
        message = '비밀번호를 입력해 주세요.';
    }
    
    if (message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        if (!idValue) idInput.focus();
        else pwInput.focus();
        return;
    }

    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    try {
        const res = await fetch(ENDPOINT.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: idValue,
                password: pwValue
            })
        });
    
    if (!res.ok) {
        errorMessage.textContent = '아이디 또는 비밀번호가 일치하지 않습니다.';
        errorMessage.classList.add('show');
        pwInput.value = '';
        pwInput.focus();
        return;
    }

    const data = await res.json();

    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    if (redirectUrl) {
        window.location.href = decodeURIComponent(redirectUrl);
    } else {
        if (document.referrer && document.referrer.includes(window.location.origin)) {
            window.history.back();
        } else {
            window.location.href = "/index.html"; 
        }
    }} catch (error) {
        errorMessage.textContent = '서버 오류';
        errorMessage.classList.add('show');
        pwInput.value = '';
        pwInput.focus();
    }
});
