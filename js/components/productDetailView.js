/**
 * 가격 포맷팅 (천 단위 콤마)
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
    return price.toLocaleString('ko-KR');
}

/**
 * 상품 상세 정보 마크업 생성
 * @param {object} product - 상품 데이터
 * @returns {string} HTML 문자열
 */
export function createProductMarkup(product) {
    return `
    <section class="product-overview">
            <h2 class="sr-only">상품 상세페이지</h2>
            <figure class="product-image">
                <img src="${product.image}" alt="${product.name} 이미지">
            </figure>

            <section class="product-info">
                <h2 class="sr-only">상품 정보</h2>
                <header class="product-header">
                    <p class="product-brand">${product.seller.store_name}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <span class="price">${formatPrice(product.price)}</span>
                </header>

                <section class="delivery-info">
                    <h2 class="sr-only">배송 정보</h2>
                    <dl>
                        <dt>${product.shipping_method === 'PARCEL' ? '택배배송' : '직접배송'}</dt>
                        <dd>${product.shipping_fee === 0 ? '무료배송' : formatPrice(product.shipping_fee) + '원'}</dd>
                    </dl>
                </section>

                <form class="purchase-form" action="#">
                    <fieldset class="quantity-selector">
                        <legend class="sr-only">수량 선택</legend>
                        <button type="button" class="quantity-minus">
                            <img src="./images/icon-minus-line.svg" alt="수량 감소 버튼">
                        </button>
                        <input type="number" name="quantity" value="1" min="1" max="${product.stock}" readonly />
                        <button type="button" class="quantity-plus">
                            <img src="./images/icon-plus-line.svg" alt="수량 추가 버튼">
                        </button>
                    </fieldset>

                    <section class="order-summary">
                        <h2 class="sr-only">총 상품 수량, 금액</h2>
                        <dl class="total-info">
                            <dt>총 상품 금액</dt>
                            <dd>
                                <p class="quantity-display">총 수량 <span>1</span>개</p>
                                <p class="total-price"><span>${formatPrice(product.price)}</span>원</p>
                            </dd>
                        </dl>
                    </section>

                    <section class="action-buttons">
                        <h2 class="sr-only">구매, 장바구니 버튼</h2>
                        <button type="submit" class="add-to-cart">바로 구매</button>
                        <button type="button" class="wishlist">장바구니</button>
                    </section>
                </form>
            </section>
        </section>

        <nav class="product-nav">
            <ul>
                <li><button>버튼</button></li>
                <li><button>리뷰</button></li>
                <li><button>Q&A</button></li>
                <li><button>반품/교환정보</button></li>
            </ul>
        </nav>
    `;
}