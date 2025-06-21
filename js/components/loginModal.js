import { isLoggedIn } from '../core/auth.js';

/**
 * 비로그인 상태일 경우 로그인 확인 모달을 띄우고
 * 사용자가 "예"를 누르면 true, 아니면 false를 반환합니다.
 * @returns {Promise<boolean>}
 */
export function showLoginModalIfNeeded() {
    return new Promise((resolve) => {
        if (isLoggedIn()) {
            resolve(false);
            return;
        }

    const modal = document.getElementById('login-confirm-modal');
    if (!modal) {
        resolve(false);
        return;
    }

    modal.addEventListener(
        'close',
        () => resolve(modal.returnValue === 'yes'),
        { once: true }
    );

    modal.showModal();
    });
}
