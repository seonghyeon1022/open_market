// ==================== 상수 및 DOM ====================
const API_BASE = 'https://api.wenivops.co.kr/services/open-market';

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
const termsCheck = document.querySelector('#terms');

const inputOrder = [
    userIdInput,
    passwordInput,
    passwordConfirmInput,
    userNameInput,
    phoneMiddleInput,
    phoneLastInput,
];

const idRegex = /^[A-Za-z0-9]{1,20}$/;


// ==================== 공통 유틸 함수 ====================
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
    if (icon) {
        icon.src = isValid ? './images/icon-check-on.svg' : './images/icon-check-off.svg';
    }
}

// ==================== 유효성 검사 함수 ====================
function validateUserId() {
    const username = userIdInput.value.trim();
    if (!username) {
        setError(userIdInput, '필수 정보입니다.');
        return false;
    }
    if (!idRegex.test(username)) {
        setError(userIdInput, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능 합니다.');
        return false;
    }
    clearError(userIdInput);
    return true;
}

function validatePassword() {
    const pwd = passwordInput.value;
    const isValid =
        pwd.length >= 8 &&
        /[a-z]/.test(pwd) &&
        /\d/.test(pwd);

    if (!isValid) {
        setError(passwordInput, '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        setCheckIcon(passwordInput, false);
        return false;
    }
    clearError(passwordInput);
    setCheckIcon(passwordInput, true);
    return true;
}

function validatePasswordConfirm() {
    const pwd = passwordInput.value;
    const confirmPwd = passwordConfirmInput.value;

    if (!confirmPwd) {
        clearError(passwordConfirmInput);
        setCheckIcon(passwordConfirmInput, false);
        return false;
    }

    const isMatch = pwd === confirmPwd;
    if (!isMatch) {
        setError(passwordConfirmInput, '비밀번호가 일치하지 않습니다.');
        setCheckIcon(passwordConfirmInput, false);
        return false;
    }
    clearError(passwordConfirmInput);
    setCheckIcon(passwordConfirmInput, true);
    return true;
}

// ==================== 버튼 활성화 상태 업데이트 함수 ====================
function updateSignupButtonState() {
    const allFilled = userIdInput.value.trim() &&
                    passwordInput.value &&
                    passwordConfirmInput.value &&
                    userNameInput.value.trim() &&
                    phoneMiddleInput.value.trim() &&
                    phoneLastInput.value.trim();

    const isValid = validateUserId() &&
                    validatePassword() &&
                    validatePasswordConfirm();

    const isAgreed = termsCheck.checked;

    if (allFilled && isValid && isAgreed) {
        signupBtn.classList.add('active');
        signupBtn.disabled = false;
    } else {
        signupBtn.classList.remove('active');
        signupBtn.disabled = true;
    }
}

// ==================== 이벤트 핸들러 함수 ====================
function handleTabClick(e) {
    tabItems.forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');
}

async function handleCheckUsername() {
    if (!validateUserId()) return;

    const username = userIdInput.value.trim();

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
        } else {
            setError(userIdInput, data.error === '이미 사용 중인 아이디입니다.' ? data.error : '알 수 없는 오류가 발생했습니다.');
        }
    } catch (err) {
        console.error('중복 확인 실패:', err);
        setError(userIdInput, '중복 확인 실패');
    }
}

function handleFocusInput(idx) {
    for (let i = 0; i < idx; i++) {
        if (!inputOrder[i].value.trim()) {
            setError(inputOrder[i], '필수 정보입니다.');
        }
    }
}

function handleClearOnInput(input) {
    clearError(input);
}

async function handleSignup(e) {
    e.preventDefault();

    if (!validateUserId()) {
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
        if (!phoneMiddleInput.value.trim()) {
            phoneMiddleInput.style.borderColor = '#EB5757';
            phoneMiddleInput.focus();
        } else {
            phoneLastInput.style.borderColor = '#EB5757';
            phoneLastInput.focus();
        }
        return;
    }

    const payload = {
        username: userIdInput.value.trim(),
        password: passwordInput.value,
        name: userNameInput.value.trim(),
        phone_number: phonePreSelect.value + phoneMiddleInput.value.trim() + phoneLastInput.value.trim(),
    };

    try {
        const res = await fetch(`${API_BASE}/accounts/buyer/signup/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok && data.phone_number?.[0] === '해당 사용자 전화번호는 이미 존재합니다.') {
            const msgEl = getMessageElement(phoneLastInput);
            msgEl.textContent = '해당 사용자 전화번호는 이미 존재합니다.';
            msgEl.style.color = '#EB5757';
        } else if (res.ok) {
            // location.href = '/welcome';
        }

    } catch (err) {
        console.error('서버 오류:', err);
    }
}


// ==================== 이벤트 리스너 등록 ====================
tabItems.forEach(tab => tab.addEventListener('click', handleTabClick));
checkBtn.addEventListener('click', handleCheckUsername);
signupBtn.addEventListener('click', handleSignup);

inputOrder.forEach((input, idx) => {
    input.addEventListener('focus', () => handleFocusInput(idx));
    input.addEventListener('input', () => handleClearOnInput(input));
});

passwordInput.addEventListener('input', () => {
    validatePassword();
    validatePasswordConfirm();
});

passwordConfirmInput.addEventListener('input', validatePasswordConfirm);
