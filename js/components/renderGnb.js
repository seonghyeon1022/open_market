// components/renderHeader.js
import { isLoggedIn } from '../core/auth.js';
import { setupMypageIconToggle } from './mypageDropdown.js.js';

export function renderHeader() {
    const loggedIn = isLoggedIn();

    const loginOrMypageMarkup = loggedIn
        ? `
            <li class="gnb__menu-item">
                <a href="#none" id="mypage-link">
                    <img src="./images/icon-user.svg" alt="마이페이지" id="mypage-icon">
                    <span>마이페이지</span>
                </a>
                <div class="mypage-dropdown" id="mypage-dropdown">
                    <a href="#none" class="mypage-dropdown__item">마이페이지</a>
                    <a href="#none" class="mypage-dropdown__item" id="logout-btn">로그아웃</a>
                </div>
            </li>
        `
        : `
            <li class="gnb__menu-item">
                <a href="./login.html">
                    <img src="./images/icon-user.svg" alt="로그인">
                    <span>로그인</span>
                </a>
            </li>
        `;

    const headerHTML = `
        <section class="gnb__left">
            <h1 class="gnb__logo">
                <a href="/index.html">
                    <img src="./images/Logo-hodu.png" alt="HODU">
                </a>
            </h1>
            <form action="#" class="gnb__search-form">
                <label for="search-input" class="sr-only">상품검색</label>
                <input type="search" id="search-input" placeholder="상품을 검색해보세요!">
                <button type="submit">
                    <img src="./images/icon-search.svg" alt="검색">
                </button>
            </form>
        </section>
        <nav class="gnb__right">
            <ul class="gnb__menu">
                <li class="gnb__menu-item">
                    <a href="#none">
                        <img src="./images/icon-shopping-cart.svg" alt="장바구니">
                        <span>장바구니</span>
                    </a>
                </li>
                ${loginOrMypageMarkup}
            </ul>
        </nav>
    `;

    const gnbHeader = document.querySelector('#gnb-header');
    gnbHeader.innerHTML = headerHTML;

    if (loggedIn) {
        setupMypageIconToggle();
    }
}
