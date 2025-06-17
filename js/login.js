const loginForm = document.querySelector('.login__form');
const idInput = document.getElementById('id');
const pwInput = document.getElementById('pw');
const errorMessage = document.getElementById('loginError');

// 폼 제출 이벤트 리스너
loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // 기본 제출 동작 방지
    
    const idValue = idInput.value.trim();
    const pwValue = pwInput.value.trim();
    
    // 아이디나 비밀번호가 비어있는지 확인
    if (!idValue || !pwValue) {
        let message = '';
        
        if (!idValue && !pwValue) {
            message = '아이디와 비밀번호를 입력해 주세요.';
        } else if (!idValue) {
            message = '아이디를 입력해 주세요.';
        } else if (!pwValue) {
            message = '비밀번호를 입력해 주세요.';
        }
        
        // 경고 메시지 표시
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        return; // 로그인 진행하지 않음
    }
    
    // 입력이 모두 되어있으면 경고 메시지 숨기기
    errorMessage.style.display = 'none';
    
    // 여기서 실제 로그인 처리 (아직 구현 안함)
    console.log('로그인 진행:', { id: idValue, pw: pwValue });
});