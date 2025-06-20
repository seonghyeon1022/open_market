/**
 * 수량 변경 기능 초기화
 * @param {Object} product - 상품 객체
 * @param {number} product.price - 상품 가격
 * @param {number} product.stock - 재고 수량
 */
export function setupQuantityHandler(product) {
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');
    const quantityInput = document.querySelector('input[name="quantity"]');
    const quantityDisplay = document.querySelector('.quantity-display span');
    const totalPriceDisplay = document.querySelector('.total-price span');

    if (!minusBtn || !plusBtn || !quantityInput) return;

    let quantity = parseInt(quantityInput.value, 10);
    const maxStock = product.stock;
    const unitPrice = product.price;

    function updateDisplay() {
        quantityInput.value = quantity;
        quantityDisplay.textContent = quantity;
        totalPriceDisplay.textContent = `${(unitPrice * quantity).toLocaleString('ko-KR')}`;
    }

    plusBtn.addEventListener('click', () => {
        if (quantity < maxStock) {
            quantity++;
            updateDisplay();
        }
    });

    minusBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            updateDisplay();
        }
    });
}
