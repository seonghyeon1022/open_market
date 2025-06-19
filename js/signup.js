const API_BASE = 'https://api.wenivops.co.kr/services/open-market';

// DOM Elements
const tabItems = document.querySelectorAll('.sign__tab-item');
const userIdInput = document.querySelector('#userId');
const checkBtn = document.querySelector('.check-btn');
const signupBtn = document.querySelector('.signup-btn');
const passwordInput = document.querySelector('#password');
const passwordConfirmInput = document.querySelector('#passwordConfirm');
const userNameInput = document.querySelector('#userName');
const phonePreSelect = document.querySelector('#phonePre');
const phoneMiddleInput = document.querySelector('#phoneMiddle');
const phoneLastInput = document.querySelector('#phoneLast');

// 메시지/아이콘 관련 함수
function getMessageElement(input) {
    return input.closest('.form-group')?.querySelector('.input-message');
}
function getPasswordCheckIcon(input) {
    return input.closest('.input-wrapper')?.querySelector('.password-check');
}

function setError(input, message) {
    const msgEl = getMessageElement(input);
    if (msgEl) {
        msgEl.textContent = message;
        msgEl.style.color = '#EB5757';
    }
    input.style.borderColor = '#EB5757';
}
function clearError(input) {
    const msgEl = getMessageElement(input);
    if (msgEl) {
        msgEl.textContent = '';
        msgEl.style.color = '';
    }
    input.style.borderColor = '';
}

function setCheckIcon(input, isValid) {
    const icon = getPasswordCheckIcon(input);
    if (!icon) return;
    icon.src = isValid ? './images/icon-check-on.svg' : './images/icon-check-off.svg';
    }

// 아이디 정규식
const idRegex = /^[A-Za-z0-9]{1,20}$/;

// 탭 전환
tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
        tabItems.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
    });
});

// 아이디 중복 확인
checkBtn.addEventListener('click', async () => {
    const username = userIdInput.value.trim();

    if (!username) {
        setError(userIdInput, '필수 정보입니다.');
        return;
    }
    if (!idRegex.test(username)) {
        setError(userIdInput, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능 합니다.');
        return;
    }
    clearError(userIdInput);

    try {
    const res = await fetch(`${API_BASE}/accounts/validate-username/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    const data = await res.json();

    if (res.ok) {
        const msgEl = getMessageElement(userIdInput);
        msgEl.textContent = '멋진 아이디네요 :)';
        msgEl.style.color = '#21BF48';
        userIdInput.style.borderColor = '#21BF48';
    } else {
        setError(userIdInput, data.error === '이미 사용 중인 아이디입니다.' ? '이미 사용 중인 아이디입니다.' : '알 수 없는 오류가 발생했습니다.');
    }
    } catch (err) {
        setError(userIdInput, '서버 오류가 발생했습니다.');
        console.error('중복 확인 실패:', err);
    }
});

// 순차 입력 유효성 체크 (포커스 시 이전 필드 체크)
const inputOrder = [userIdInput, passwordInput, passwordConfirmInput, userNameInput, phoneMiddleInput, phoneLastInput];

inputOrder.forEach((input, idx) => {
    input.addEventListener('focus', () => {
    for (let i = 0; i < idx; i++) {
            const prevInput = inputOrder[i];
            if (!prevInput.value.trim()) {
            setError(prevInput, '필수 정보입니다.');
            }
        }
    });
    input.addEventListener('input', () => {
        clearError(input);
    });
});

// 비밀번호 유효성 검사
function validatePassword() {
    const pwd = passwordInput.value;
    const minLength = pwd.length >= 8;
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);

    if (!(minLength && hasLowercase && hasNumber)) {
        setError(passwordInput, '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        setCheckIcon(passwordInput, false);
        return false;
    } else {
        clearError(passwordInput);
        setCheckIcon(passwordInput, true);
        return true;
    }
}
passwordInput.addEventListener('input', () => {
    validatePassword();
    validatePasswordConfirm(); // 비밀번호 바뀌면 재확인도 검사
});

// 비밀번호 재확인 검사
function validatePasswordConfirm() {
    const pwd = passwordInput.value;
    const confirmPwd = passwordConfirmInput.value;

    if (!confirmPwd) {
        clearError(passwordConfirmInput);
        setCheckIcon(passwordConfirmInput, false);
        return false;
    }

    if (pwd === confirmPwd) {
        clearError(passwordConfirmInput);
        setCheckIcon(passwordConfirmInput, true);
        return true;
    } else {
        setError(passwordConfirmInput, '비밀번호가 일치하지 않습니다.');
        setCheckIcon(passwordConfirmInput, false);
        return false;
    }
    }
passwordConfirmInput.addEventListener('input', validatePasswordConfirm);

// 회원가입 처리
signupBtn.addEventListener('click', async e => {
    e.preventDefault();

  // 필수 입력 체크
    if (!userIdInput.value.trim()) {
        setError(userIdInput, '필수 정보입니다.');
        userIdInput.focus();
        return;
    }
    if (!validatePassword()) {
        passwordInput.focus();
        return;
    }
    if (!validatePasswordConfirm()) {
        passwordConfirmInput.focus();
        return;
    }
    if (!userNameInput.value.trim()) {
        setError(userNameInput, '필수 정보입니다.');
        userNameInput.focus();
        return;
    }
    if (!phoneMiddleInput.value.trim() || !phoneLastInput.value.trim()) {
        const phoneMessageEl = phoneLastInput.closest('.form-group').querySelector('.input-message');
        phoneMessageEl.textContent = '필수 정보입니다.';
        phoneMessageEl.style.color = '#EB5757';
    if (!phoneMiddleInput.value.trim()) phoneMiddleInput.style.borderColor = '#EB5757';
    if (!phoneLastInput.value.trim()) phoneLastInput.style.borderColor = '#EB5757';
    if (!phoneMiddleInput.value.trim()) phoneMiddleInput.focus();
    else phoneLastInput.focus();
    return;
    }

    const username = userIdInput.value.trim();
    const password = passwordInput.value;
    const name = userNameInput.value.trim();
    const phoneNumber = phonePreSelect.value + phoneMiddleInput.value.trim() + phoneLastInput.value.trim();

    try {
        const res = await fetch(`${API_BASE}/accounts/buyer/signup/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, name, phone_number: phoneNumber }),
        });
    const data = await res.json();

    if (!res.ok) {
        if (data.phone_number?.[0] === '해당 사용자 전화번호는 이미 존재합니다.') {
            const phoneMessageEl = phoneLastInput.closest('.form-group').querySelector('.input-message');
            phoneMessageEl.textContent = '해당 사용자 전화번호는 이미 존재합니다.';
            phoneMessageEl.style.color = '#EB5757';
        } 
        return;
    }

    // location.href = '/welcome'; // 필요시 리다이렉트

    } catch (err) {
        console.error('서버 오류:', err);
    }
});
