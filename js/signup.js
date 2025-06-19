import { ENDPOINT } from './api/config.js';

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

/**
 * 특정 입력 요소의 에러 메시지 요소를 찾음
 * @param {HTMLElement} input - 입력 요소
 * @returns {HTMLElement|null} - 메시지 요소 혹은 null
 */
function getMessageElement(input) {
    return input.closest('.form-group')?.querySelector('.input-message');
}

/**
 * 비밀번호 입력란 옆 체크 아이콘 요소 반환
 * @param {HTMLElement} input - 비밀번호 입력 요소
 * @returns {HTMLImageElement|null} - 체크 아이콘 이미지 요소 혹은 null
 */
function getPasswordCheckIcon(input) {
    return input.closest('.input-wrapper')?.querySelector('.password-check');
}

/**
 * 입력 요소에 에러 스타일과 메시지 설정
 * @param {HTMLElement} input - 입력 요소
 * @param {string} message - 표시할 에러 메시지
 */
function setError(input, message) {
    const msgEl = getMessageElement(input);
    if (msgEl) {
        msgEl.textContent = message;
        msgEl.style.color = '#EB5757';
    }
    input.style.borderColor = '#EB5757';
}

/**
 * 입력 요소의 에러 메시지와 스타일 초기화
 * @param {HTMLElement} input - 입력 요소
 */
function clearError(input) {
    const msgEl = getMessageElement(input);
    if (msgEl) {
        msgEl.textContent = '';
        msgEl.style.color = '';
    }
    input.style.borderColor = '';
}

/**
 * 비밀번호 체크 아이콘 이미지 변경
 * @param {HTMLElement} input - 비밀번호 입력 요소
 * @param {boolean} isValid - 유효성 통과 여부
 */
function setCheckIcon(input, isValid) {
    const icon = getPasswordCheckIcon(input);
    if (icon) {
        icon.src = isValid ? './images/icon-check-on.svg' : './images/icon-check-off.svg';
    }
}

/**
 * 사용자 아이디 유효성 검사
 * @returns {boolean} 유효하면 true, 아니면 false
 */
function validateUserId() {
    const username = userIdInput.value.trim();
    const idRegex = /^[A-Za-z0-9]{1,20}$/;
    
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

/**
 * 비밀번호 유효성 검사 (8자 이상, 영문 소문자, 숫자 포함)
 * @returns {boolean} 유효하면 true, 아니면 false
 */
function validatePassword() {
    const pwd = passwordInput.value;

    if (!pwd) {
        clearError(passwordInput);
        setCheckIcon(passwordInput, false);
        return false;
    }

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

/**
 * 비밀번호 확인 유효성 검사 (비밀번호와 일치하는지)
 * @returns {boolean} 일치하면 true, 아니면 false
 */
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

/**
 * 모든 입력 필드와 약관 동의 여부에 따라 회원가입 버튼 활성화 상태 변경
 */
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

/**
 * 회원가입 탭 클릭 시 활성화 상태 변경
 * @param {Event} e - 클릭 이벤트 객체
 */
function handleTabClick(e) {
    tabItems.forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');
}

/**
 * 아이디 중복 확인 API 호출 및 결과 처리
 */
async function handleCheckUsername() {
    if (!validateUserId()) return;

    const username = userIdInput.value.trim();

    try {
        const res = await fetch(ENDPOINT.VALIDATE_USERNAME, {
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

/**
 * 현재 포커스된 입력 필드 인덱스 이전에 비어있는 필드가 있으면 에러 메시지 표시
 * @param {number} idx - 현재 입력 필드 인덱스
 */
function handleFocusInput(idx) {
    for (let i = 0; i < idx; i++) {
        if (!inputOrder[i].value.trim()) {
            setError(inputOrder[i], '필수 정보입니다.');
        }
    }
}

/**
 * 입력 시 에러 메시지 및 스타일 초기화
 * @param {HTMLElement} input - 입력 요소
 */
function handleClearOnInput(input) {
    clearError(input);
}

/**
 * 회원가입 폼 제출 처리
 * @param {Event} e - submit 혹은 click 이벤트 객체
 */
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
        const res = await fetch(ENDPOINT.SIGNUP_BUYER, {
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
            location.href = '../login.html';
        }

    } catch (err) {
        console.error('서버 오류:', err);
    }
}

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

inputOrder.forEach(input => {
    input.addEventListener('input', updateSignupButtonState);
});

termsCheck.addEventListener('change', updateSignupButtonState);

signupBtn.disabled = true;