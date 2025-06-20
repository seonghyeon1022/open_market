import { ENDPOINT } from './api/config.js';
import { createProductMarkup } from './components/productDetailView.js';

const productId = new URLSearchParams(window.location.search).get('id');
const main = document.querySelector('.product-detail');

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
}

document.addEventListener('DOMContentLoaded', init);
