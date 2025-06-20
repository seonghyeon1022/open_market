import { ENDPOINT } from './api/config.js';

const productsSection = document.querySelector('.products-section');

/**
 * 가격 포맷팅 (천단위 콤마)
 * @param {number} price - 원화 가격
 * @returns {string} 포맷된 가격 문자열
 */
function formatPrice(price) {
    return price.toLocaleString('ko-KR');
}

/**
 * 상품 카드 HTML 생성
 */
function createProductCard(product) {
    return `
        <article class="product-card">
            <h3 class="sr-only">${product.name}</h3>
            <a href="#none">
                <img src="${product.image}" alt="${product.name} 이미지">
                <p class="product-card__brand">${product.seller.store_name}</p>
                <h3 class="product-card__name">${product.info}</h3>
                <p class="product-card__price">${formatPrice(product.price)}</p>
            </a>
        </article>
    `;
}

/**
 * 상품 데이터를 받아 DOM에 렌더링
 * @param {Object[]} products - 상품 객체 배열
 */
function renderProducts(products) {
    products.forEach(product => {
        const cardHTML = createProductCard(product);
        productsSection.insertAdjacentHTML('beforeend', cardHTML);
    });
}

/**
 * API에서 상품 목록 가져오기
 * @returns {Promise<Object[]>} 상품 객체 배열
 */
async function fetchProducts() {
    try {
        const res = await fetch(ENDPOINT.GET_PRODUCTS);
        const data = await res.json();
        return data.results;
    } catch (error) {
        console.error('상품 목록 조회 실패:', error);
        return [];
    }
}

/**
 * 상품 목록 로드 및 렌더링
 */
export async function loadProducts() {
    const products = await fetchProducts();
    renderProducts(products);
}