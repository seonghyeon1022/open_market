import { showLoginModalIfNeeded } from '../components/loginModal.js';

/**
 * 비로그인 상태에서 구매/장바구니 버튼 클릭 시 로그인 유도 모달을 표시합니다.
 * 
 * - 로그인 상태일 경우 아무 동작 없음
 * - 모달에서 "예" 선택 시 로그인 페이지로 이동
 * 
 * @param {string} buyBtnSelector - 구매 버튼을 찾기 위한 CSS 선택자 (예: '.add-to-cart')
 * @param {string} wishlistBtnSelector - 장바구니 버튼을 찾기 위한 CSS 선택자 (예: '.wishlist')
 */
export function setupLoginModalOnButtons(buyBtnSelector, wishlistBtnSelector) {
    const buyBtn = document.querySelector(buyBtnSelector);
    const wishlistBtn = document.querySelector(wishlistBtnSelector);

    const handleClick = async (e) => {
        e.preventDefault();
        const confirmed = await showLoginModalIfNeeded();
        if (confirmed) {
            window.location.href = '/login.html';
        }
    };

    buyBtn?.addEventListener('click', handleClick);
    wishlistBtn?.addEventListener('click', handleClick);
}
