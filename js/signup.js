const API_BASE = 'https://api.wenivops.co.kr/services/open-market';

// DOM 요소들
const elements = {
    tabItems: document.querySelectorAll('.sign__tab-item'),
    userId: document.querySelector('#userId'),
    checkBtn: document.querySelector('.check-btn'),
    password: document.querySelector('#password'),
    passwordConfirm: document.querySelector('#passwordConfirm'),
    userName: document.querySelector('#userName'),
    phonePre: document.querySelector('#phonePre'),
    phoneMiddle: document.querySelector('#phoneMiddle'),
    phoneLast: document.querySelector('#phoneLast'),
    signupBtn: document.querySelector('.signup-btn'),
    terms: document.querySelector('#terms')
};

// 유틸리티 함수들
const utils = {
    // 메시지 요소 가져오기
    getMessageEl: (input) => input.closest('.form-group')?.querySelector('.input-message'),
    
    // 체크 아이콘 가져오기
    getCheckIcon: (input) => input.closest('.input-wrapper')?.querySelector('.password-check'),
    
    // 메시지 표시
    showMessage: (input, message, isError = true) => {
        const messageEl = utils.getMessageEl(input);
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.style.color = isError ? '#EB5757' : '#21BF48';
            input.style.borderColor = isError ? '#EB5757' : '';
        }
    },
    
    // 체크 아이콘 업데이트
    updateCheckIcon: (input, isValid) => {
        const icon = utils.getCheckIcon(input);
        if (icon) {
            icon.src = `./images/icon-check-${isValid ? 'on' : 'off'}.svg`;
        }
    },
    
    // 입력값 초기화
    clearMessage: (input) => {
        const messageEl = utils.getMessageEl(input);
        if (messageEl) {
            messageEl.textContent = '';
            input.style.borderColor = '';
        }
    }
};

// 유효성 검사 규칙
const validators = {
    userId: (value) => {
        if (!value.trim()) return '필수 정보입니다.';
        if (!/^[A-Za-z0-9]{1,20}$/.test(value)) return '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능 합니다.';
        return null;
    },
    
    password: (value) => {
        const minLength = value.length >= 8;
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        
        if (!(minLength && hasLowercase && hasNumber)) {
            return '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.';
        }
        return null;
    },
    
    required: (value) => value.trim() ? null : '필수 정보입니다.'
};

// 이벤트 핸들러들
const handlers = {
    // 탭 전환
    tabSwitch: (e) => {
        elements.tabItems.forEach(item => item.classList.remove('active'));
        e.target.closest('.sign__tab-item').classList.add('active');
    },
    
    // 아이디 중복확인
    checkUserId: async () => {
        const username = elements.userId.value.trim();
        const error = validators.userId(username);
        
        if (error) {
            utils.showMessage(elements.userId, error);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/accounts/validate-username/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const data = await res.json();

            if (res.ok) {
                utils.showMessage(elements.userId, '멋진 아이디네요 :)', false);
            } else {
                const message = data.error === '이미 사용 중인 아이디입니다.' 
                    ? '이미 사용 중인 아이디입니다.' 
                    : '알 수 없는 오류가 발생했습니다.';
                utils.showMessage(elements.userId, message);
            }
        } catch (err) {
            utils.showMessage(elements.userId, '서버 오류가 발생했습니다.');
            console.error('중복 확인 실패:', err);
        }
    },
    
    // 비밀번호 유효성 검사
    validatePassword: () => {
        const error = validators.password(elements.password.value);
        const isValid = !error;
        
        if (error) {
            utils.showMessage(elements.password, error);
        } else {
            utils.clearMessage(elements.password);
        }
        
        utils.updateCheckIcon(elements.password, isValid);
    },
    
    // 비밀번호 재확인
    validatePasswordConfirm: () => {
        const password = elements.password.value;
        const confirmPassword = elements.passwordConfirm.value;
        const isValid = password && password === confirmPassword;
        
        if (!isValid) {
            utils.showMessage(elements.passwordConfirm, '비밀번호가 일치하지 않습니다.');
        } else {
            utils.clearMessage(elements.passwordConfirm);
        }
        
        utils.updateCheckIcon(elements.passwordConfirm, isValid);
    },
    
    // 하위 필드 포커스 시 경고 문구
    validateSequentialInput: (currentIndex) => {
        const inputOrder = [
            elements.userId,
            elements.password,
            elements.passwordConfirm,
            elements.userName,
            elements.phoneMiddle,
            elements.phoneLast
        ];
        
        for (let i = 0; i < currentIndex; i++) {
            const prevInput = inputOrder[i];
            if (!prevInput.value.trim()) {
                utils.showMessage(prevInput, '필수 정보입니다.');
            }
        }
    },
    
    // 입력 필드 포커스/입력 처리
    handleInput: (input, validator, inputIndex) => {
        return {
            focus: () => {
                // 순차 입력 검증
                handlers.validateSequentialInput(inputIndex);
            },
            input: () => {
                if (input.value.trim()) {
                    utils.clearMessage(input);
                }
            }
        };
    },
    
    // 회원가입 제출
    signup: async (e) => {
        e.preventDefault();
        
        const formData = {
            username: elements.userId.value.trim(),
            password: elements.password.value,
            name: elements.userName.value.trim(),
            phone_number: elements.phonePre.value + elements.phoneMiddle.value.trim() + elements.phoneLast.value.trim()
        };

        try {
            const res = await fetch(`${API_BASE}/accounts/buyer/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.phone_number?.[0] === '해당 사용자 전화번호는 이미 존재합니다.') {
                    utils.showMessage(elements.phoneLast, '해당 사용자 전화번호는 이미 존재합니다.');
                }
                return;
            }
            
            // 성공 처리
            // location.href = '/welcome';
            
        } catch (err) {
            console.error('서버 오류:', err);
        }
    }
};

// 이벤트 리스너 등록
const initEvents = () => {
    // 탭 전환
    elements.tabItems.forEach(tab => {
        tab.addEventListener('click', handlers.tabSwitch);
    });
    
    // 아이디 중복확인
    elements.checkBtn.addEventListener('click', handlers.checkUserId);
    
    // 비밀번호 유효성 검사
    elements.password.addEventListener('input', handlers.validatePassword);
    elements.passwordConfirm.addEventListener('input', handlers.validatePasswordConfirm);
    
    // 필수 입력 필드들 (순서 중요!)
    const requiredFields = [
        { element: elements.userId, validator: validators.userId, index: 0 },
        { element: elements.password, validator: validators.password, index: 1 },
        { element: elements.passwordConfirm, validator: null, index: 2 },
        { element: elements.userName, validator: validators.required, index: 3 },
        { element: elements.phoneMiddle, validator: validators.required, index: 4 },
        { element: elements.phoneLast, validator: validators.required, index: 5 }
    ];
    
    requiredFields.forEach(({ element, validator, index }) => {
        const inputHandler = handlers.handleInput(element, validator, index);
        element.addEventListener('focus', inputHandler.focus);
        element.addEventListener('input', inputHandler.input);
    });
    
    // 회원가입 버튼
    elements.signupBtn.addEventListener('click', handlers.signup);
};

// 초기화
initEvents();