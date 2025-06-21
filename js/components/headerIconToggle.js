export function setupMypageIconToggle() {
    const mypageLink = document.getElementById('mypage-link');
    const mypageIcon = document.getElementById('mypage-icon');

    if (!mypageLink || !mypageIcon) return;

    mypageLink.addEventListener('click', (e) => {
        e.preventDefault();
        const iconA = './images/icon-user.svg';
        const iconB = './images/icon-user-2.svg';
        const currentSrc = mypageIcon.getAttribute('src');
        mypageIcon.setAttribute('src', currentSrc === iconA ? iconB : iconA);
    });
}
