const loginForm = document.querySelector('.login__form');
const idInput = document.getElementById('id');
const pwInput = document.getElementById('pw');
const errorMessage = document.getElementById('loginError');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const idValue = idInput.value.trim();
    const pwValue = pwInput.value.trim();
    let message = '';

    if (!idValue && !pwValue) {
        message = '아이디를 입력해 주세요.';
        idInput.focus();
    } else if (!idValue) {
        message = '아이디를 입력해 주세요.';
        idInput.focus();
    } else if (!pwValue) {
        message = '비밀번호를 입력해 주세요.';
        pwInput.focus();
    }
    
    // 메시지가 있으면 에러 처리
    if (message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        return;
    }

    // 에러 메시지 숨기기
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    console.log('로그인 진행:', { id: idValue, pw: pwValue });
});
