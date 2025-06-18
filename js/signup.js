const API_BASE = 'https://api.wenivops.co.kr/services/open-market';

const tabItems = document.querySelectorAll('.sign__tab-item');
const userIdInput = document.querySelector('#userId');
const checkBtn = document.querySelector('.check-btn');
const inputMessage = document.querySelector('#userId').closest('.form-group').querySelector('.input-message');

// 회원가입 탭 전환
tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => {
    tabItems.forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
    });
});

// 아이디 중복확인, 유효성 검사
checkBtn.addEventListener('click', async () => {
    const username = userIdInput.value.trim();
    const idRegex = /^[A-Za-z0-9]{1,20}$/;

    if (!username) {
        inputMessage.textContent = '필수 정보입니다.';
        inputMessage.style.color = '#EB5757';
        userIdInput.style.borderColor = '#EB5757';
        return;
    }

    if (!idRegex.test(username)) {
        inputMessage.textContent = '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능 합니다.';
        inputMessage.style.color = '#EB5757';
        userIdInput.style.borderColor = '#EB5757';
        return;
    }


    try {
        const res = await fetch(`${API_BASE}/accounts/validate-username/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
    });

    const data = await res.json();

    if (res.ok) {
        inputMessage.textContent = '멋진 아이디네요 :)';
        inputMessage.style.color = '#21BF48';
        userIdInput.style.borderColor = '#21BF48';
    } else {
        if (data.error === '이미 사용 중인 아이디입니다.') {
        inputMessage.textContent = '이미 사용 중인 아이디입니다.';
        } else {
        inputMessage.textContent = '알 수 없는 오류가 발생했습니다.';
        }

        inputMessage.style.color = '#EB5757';
        userIdInput.style.borderColor = '#EB5757';
    }

    } catch (err) {
        inputMessage.textContent = '서버 오류가 발생했습니다.';
        inputMessage.style.color = '#EB5757';
        userIdInput.style.borderColor = '#EB5757';
        console.error('중복 확인 실패:', err);
    }
});

// 하위 필드 포커스시 경고문구 표시
const inputOrder = [
    document.querySelector('#userId'),
    document.querySelector('#password'),
    document.querySelector('#passwordConfirm'),
    document.querySelector('#userName'),
    document.querySelector('#phoneMiddle'),
    document.querySelector('#phoneLast'),
];

function getMessageElement(input) {
    return input.closest('.form-group')?.querySelector('.input-message');
}

inputOrder.forEach((input, index) => {
    input.addEventListener('focus', () => {
        for (let i = 0; i < index; i++) {
            const prevInput = inputOrder[i];
            const value = prevInput.value.trim();
            const messageEl = getMessageElement(prevInput);

            if (!value && messageEl) {
                messageEl.textContent = '필수 정보입니다.';
                messageEl.style.color = '#EB5757';
                prevInput.style.borderColor = '#EB5757';
            }
        }
    });

    input.addEventListener('input', () => {
        const messageEl = getMessageElement(input);
        if (messageEl && input.value.trim()) {
            messageEl.textContent = '';
            input.style.borderColor = '';
        }
    });
});

// 비밀번호 유효성 검사
const passwordInput = document.querySelector('#password');
const passwordCheckIcon = passwordInput.closest('.input-wrapper').querySelector('.password-check');
const passwordMessage = passwordInput.closest('.form-group').querySelector('.input-message');

passwordInput.addEventListener('input', () => {
    const pwd = passwordInput.value;

    const minLength = pwd.length >= 8;
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);

    if (!(minLength && hasLowercase && hasNumber)) {
        passwordMessage.textContent = '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.';
        passwordMessage.style.color = '#EB5757';
        passwordInput.style.borderColor = '#EB5757';
        passwordCheckIcon.src = './images/icon-check-off.svg';
    } else {
        passwordMessage.textContent = '';
        passwordInput.style.borderColor = '#21BF48';
        passwordCheckIcon.src = './images/icon-check-on.svg';
    }
});