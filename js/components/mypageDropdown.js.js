import { clearAuthData } from '../core/storage.js'

export function setupMypageIconToggle() {
    const mypageLink = document.getElementById('mypage-link');
    const mypageIcon = document.getElementById('mypage-icon');
    const mypageDropdown = document.getElementById('mypage-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    if (!mypageLink || !mypageIcon) return;

    const mypageText = mypageLink.querySelector('span');

    mypageLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const iconA = './images/icon-user.svg';
        const iconB = './images/icon-user-2.svg';
        const currentSrc = mypageIcon.getAttribute('src');
        const newSrc = currentSrc === iconA ? iconB : iconA;
        mypageIcon.setAttribute('src', newSrc);
        
        if (mypageDropdown) {
            mypageDropdown.classList.toggle('show');
        }

        if (mypageText) {
            if (mypageDropdown.classList.contains('show')) {
                mypageText.style.color = 'var(--main-color)';
            } else {
                mypageText.style.color = '';
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mypage-container') && mypageDropdown?.classList.contains('show')) {
            mypageDropdown.classList.remove('show');
            mypageIcon.setAttribute('src', './images/icon-user.svg');
            if (mypageText) {
                mypageText.style.color = '';
            }
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                clearAuthData();
                window.location.href = '/index.html';
            }
        });
    }
}
