function formatPrice(price) {
    return price.toLocaleString('ko-KR');
}

/**
 * 상품 카드 HTML 생성
 * @param {Object} product - 상품 데이터
 * @returns {string} 상품 카드 HTML 문자열
 */
export function createProductCard(product) {
    return `
        <article class="product-card">
            <h3 class="sr-only">${product.name}</h3>
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name} 이미지">
                <p class="product-card__brand">${product.seller.store_name}</p>
                <h3 class="product-card__name">${product.info}</h3>
                <p class="product-card__price">${formatPrice(product.price)}</p>
            </a>
        </article>
    `;
}