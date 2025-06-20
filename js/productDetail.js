import { ENDPOINT } from './api/config.js';
import { createProductMarkup } from './components/productDetailView.js';
import { setupQuantityHandler } from './components/quantitySelector.js';

const productId = new URLSearchParams(window.location.search).get('id');
const main = document.querySelector('.product-detail');

/**
 * 특정 상품의 상세 정보를 API에서 가져옵니다.
 * @param {number|string} id - 조회할 상품의 ID
 * @returns {Promise<Object|null>} 상품 객체 또는 실패 시 null
 */
async function fetchProductDetail(id) {
    try {
        const res = await fetch(`${ENDPOINT.GET_PRODUCTS}${id}/`);
        if (!res.ok) throw new Error('상품을 불러올 수 없습니다.');
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * 상세 페이지 초기화 함수
 * - 상품 ID 확인
 * - 상품 정보 요청
 * - 성공 시 마크업 생성 및 삽입
 */
async function init() {
    if (!productId) {
        console.log('상품 ID가 없습니다.');
        return;
    }

    const product = await fetchProductDetail(productId);
    if (!product) {
        console.log('상품 정보를 불러오지 못했습니다.');
    return;
    }

    main.innerHTML = createProductMarkup(product);
    setupQuantityHandler(product);

    const nav = document.querySelector('.product-nav');
    const buttons = nav.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', init);
