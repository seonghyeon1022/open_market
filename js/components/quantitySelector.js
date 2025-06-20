/**
 * 수량 변경 기능 초기화
 * HTML 페이지에서 상품 수량을 증가/감소시키는 버튼과 입력 필드를 연결하여
 * 수량 변경 시 총 가격을 자동으로 계산하고 화면에 표시합니다.
 * 
 * @param {Object} product - 상품 객체
 * @param {number} product.price - 상품 단가 (원)
 * @param {number} product.stock - 상품 재고 수량
 * @returns {void}
 * 
 * @example
 * // 상품 정보 설정 후 수량 핸들러 초기화
 * const productInfo = {
 *   price: 15000,
 *   stock: 50
 * };
 * setupQuantityHandler(productInfo);
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

    /**
     * 상품 수량 및 총가격 화면 업데이트
     * 현재 수량을 기반으로 입력 필드, 수량 표시, 총 가격을 갱신합니다.
     * 
     * @returns {void}
     */
    function updateDisplay() {
        quantityInput.value = quantity;
        quantityDisplay.textContent = quantity;
        totalPriceDisplay.textContent = unitPrice * quantity
        ? (unitPrice * quantity).toLocaleString('ko-KR')
        : '0';

        plusBtn.disabled = quantity >= maxStock;
        minusBtn.disabled = quantity <= 1;
    }

    /**
     * 수량 증가 버튼 클릭 이벤트 핸들러
     * 현재 수량이 재고 수량보다 적을 때만 수량을 1 증가시킵니다.
     * 
     * @returns {void}
     */
    function onPlusClick() {
        if (quantity < maxStock) {
        quantity++;
        updateDisplay();
        }
    }

    /**
     * 수량 감소 버튼 클릭 이벤트 핸들러
     * 현재 수량이 1보다 클 때만 수량을 1 감소시킵니다.
     * 
     * @returns {void}
     */
    function onMinusClick() {
        if (quantity > 1) {
        quantity--;
        updateDisplay();
        }
    }

    plusBtn.addEventListener('click', onPlusClick);
    minusBtn.addEventListener('click', onMinusClick);

    updateDisplay();
}
