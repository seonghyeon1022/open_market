import { increaseQuantity, decreaseQuantity, calcTotalPrice } from './quantitySelector.js';

/**
 * 수량 변경 기능 초기화
 * @param {Object} product 상품 객체
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
        totalPriceDisplay.textContent = calcTotalPrice(unitPrice, quantity);

        plusBtn.disabled = quantity >= maxStock;
        minusBtn.disabled = quantity <= 1;
    }

    function onPlusClick() {
        quantity = increaseQuantity(quantity, maxStock);
        updateDisplay();
    }

    function onMinusClick() {
        quantity = decreaseQuantity(quantity);
        updateDisplay();
    }

    plusBtn.addEventListener('click', onPlusClick);
    minusBtn.addEventListener('click', onMinusClick);

    updateDisplay();
}
