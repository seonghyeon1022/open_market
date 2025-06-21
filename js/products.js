import { ENDPOINT } from './api/config.js';
import { createProductCard } from './components/productCard.js';

const productsSection = document.querySelector('.products-section');

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