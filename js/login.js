import { ENDPOINT } from './api/config.js';
import { saveAuthData } from './core/storage.js';

const loginForm = document.querySelector('.login__form');
const idInput = document.getElementById('id');
const pwInput = document.getElementById('pw');
const errorMessage = document.getElementById('loginError');
const tabItems = document.querySelectorAll('.login__tab-item');

/**
 * 에러 메시지를 화면에 보여주고, 필요하면 해당 입력창에 포커스 이동
 * @param {string} message - 보여줄 에러 메시지
 * @param {HTMLElement} [focusInput=null] - 포커스 이동할 입력 요소
 */
function showError(message, focusInput = null) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    if (focusInput) focusInput.focus();
}

/**
 * 에러 메시지를 초기화하고 숨김 처리
 */
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

/**
 * 아이디와 비밀번호 입력창을 초기화하고 에러 메시지 제거
 */
function resetInputs() {
    idInput.value = '';
    pwInput.value = '';
    clearError();
}

/**
 * URL 쿼리에서 redirect 파라미터를 추출하여 반환
 * @returns {string|null} - redirect 파라미터 값 또는 null
 */
function getRedirectUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('redirect');
}

/**
 * 로그인 후 리다이렉트할 URL을 결정하고 이동 처리
 */
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

/**
 * 탭 클릭 시 활성화 표시를 바꾸고 입력값 초기화
 * @param {number} index - 클릭한 탭의 인덱스
 */
function handleTabClick(index) {
    tabItems.forEach(t => t.classList.remove('active'));
    tabItems[index].classList.add('active');
    resetInputs();
}

/**
 * 로그인 폼 제출 이벤트 처리
 * @param {Event} event - submit 이벤트 객체
 */
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

tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => handleTabClick(index));
});

loginForm.addEventListener('submit', handleLoginSubmit);
