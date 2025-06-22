import { clearAuthData } from '../core/storage.js';

/**
 * 마이페이지 아이콘 클릭 시 드롭다운 토글 및 아이콘 변경,
 * 외부 클릭 시 드롭다운 닫기, 로그아웃 버튼 기능을 초기화합니다.
 */
export function setupMypageIconToggle() {
    const mypageLink = document.getElementById('mypage-link');
    const mypageIcon = document.getElementById('mypage-icon');
    const mypageDropdown = document.getElementById('mypage-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const mypageText = mypageLink?.querySelector('span');

    if (!mypageLink || !mypageIcon) return;

    const ICON_DEFAULT = './images/icon-user.svg';
    const ICON_ACTIVE = './images/icon-user-2.svg';

    /**
     * 마이페이지 아이콘과 드롭다운의 표시 상태를 토글합니다.
     * @param {MouseEvent} e - 클릭 이벤트 객체
     */
    function toggleMypageDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

        const currentSrc = mypageIcon.getAttribute('src');
        const newSrc = currentSrc === ICON_DEFAULT ? ICON_ACTIVE : ICON_DEFAULT;
        mypageIcon.setAttribute('src', newSrc);

        if (mypageDropdown) {
            mypageDropdown.classList.toggle('show');
        }

        updateTextColor();
    }

    /**
     * 드롭다운 열림 상태에 따라 마이페이지 텍스트 색상을 변경합니다.
     */
    function updateTextColor() {
        if (!mypageText || !mypageDropdown) return;
        mypageText.style.color = mypageDropdown.classList.contains('show') ? 'var(--main-color)' : '';
    }

    /**
     * 외부 클릭 시 드롭다운을 닫고 아이콘과 텍스트 색상을 초기화합니다.
     * @param {MouseEvent} e - 클릭 이벤트 객체
     */
    function closeDropdownOnClickOutside(e) {
        if (!e.target.closest('.mypage-container') && mypageDropdown?.classList.contains('show')) {
            mypageDropdown.classList.remove('show');
            mypageIcon.setAttribute('src', ICON_DEFAULT);
            updateTextColor();
        }
    }

    /**
     * 로그아웃 버튼 클릭 시 인증 정보를 삭제하고 메인 페이지로 이동합니다.
     * @param {MouseEvent} e - 클릭 이벤트 객체
     */
    function handleLogout(e) {
        e.preventDefault();
        if (confirm('로그아웃 하시겠습니까?')) {
            clearAuthData();
            window.location.href = '/index.html';
        }
    }

    mypageLink.addEventListener('click', toggleMypageDropdown);
    document.addEventListener('click', closeDropdownOnClickOutside);

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}
