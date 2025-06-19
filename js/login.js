import { ENDPOINT } from './api/config.js';
import { saveAuthData } from './core/storage.js';

// ==================== 상수 & DOM 요소 ====================
const loginForm = document.querySelector('.login__form');
const idInput = document.getElementById('id');
const pwInput = document.getElementById('pw');
const errorMessage = document.getElementById('loginError');
const tabItems = document.querySelectorAll('.login__tab-item');

// ==================== 유틸 함수 ====================
function showError(message, focusInput = null) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    if (focusInput) focusInput.focus();
}

function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

function resetInputs() {
    idInput.value = '';
    pwInput.value = '';
    clearError();
}

function getRedirectUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('redirect');
}

function handleLoginRedirect() {
    const redirectUrl = getRedirectUrl();

    if (redirectUrl) {
        window.location.href = decodeURIComponent(redirectUrl);
    } else if (
        document.referrer &&
        !document.referrer.includes('/login.html') &&
        document.referrer.includes(window.location.origin)
    ) {
        window.location.href = document.referrer;
    } else {
        window.location.href = '/index.html';
    }
}

// ==================== 이벤트 핸들러 ====================
function handleTabClick(index) {
    tabItems.forEach(t => t.classList.remove('active'));
    tabItems[index].classList.add('active');
    resetInputs();
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const idValue = idInput.value.trim();
    const pwValue = pwInput.value.trim();

    if (!idValue) {
        showError('아이디를 입력해 주세요.', idInput);
        return;
    }
    if (!pwValue) {
        showError('비밀번호를 입력해 주세요.', pwInput);
        return;
    }

    clearError();

    try {
        const res = await fetch(ENDPOINT.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: idValue,
                password: pwValue,
            }),
        });

        if (!res.ok) {
            showError('아이디 또는 비밀번호가 일치하지 않습니다.', pwInput);
            pwInput.value = '';
            return;
        }

        const data = await res.json();

        saveAuthData({
            accessToken: data.access,
            refreshToken: data.refresh,
            userType: data.user.user_type,
        });

        handleLoginRedirect();
    } catch (error) {
        showError('서버 오류', pwInput);
        pwInput.value = '';
    }
}

// ==================== 이벤트 리스너 등록 ====================
tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => handleTabClick(index));
});

loginForm.addEventListener('submit', handleLoginSubmit);
