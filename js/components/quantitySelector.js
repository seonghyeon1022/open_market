/**
 * 수량을 1 증가시킴 (재고 최대치 고려)
 * @param {number} quantity 현재 수량
 * @param {number} maxStock 최대 재고 수량
 * @returns {number} 증가 후 수량
 */
export function increaseQuantity(quantity, maxStock) {
    return quantity < maxStock ? quantity + 1 : quantity;
}

/**
 * 수량을 1 감소시킴 (최소 1 고려)
 * @param {number} quantity 현재 수량
 * @returns {number} 감소 후 수량
 */
export function decreaseQuantity(quantity) {
    return quantity > 1 ? quantity - 1 : quantity;
}

/**
 * 총 가격 계산
 * @param {number} unitPrice 상품 단가
 * @param {number} quantity 수량
 * @returns {string} 총 가격 (한국 통화 표기)
 */
export function calcTotalPrice(unitPrice, quantity) {
    return (unitPrice * quantity).toLocaleString('ko-KR');
}
