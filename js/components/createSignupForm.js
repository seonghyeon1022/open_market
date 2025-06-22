/**
 * 회원가입 폼을 생성하여 반환합니다.
 * @returns {HTMLElement} 생성된 회원가입 폼을 포함한 main 요소
 */
export function createSignupForm() {
    const main = document.createElement('main');

    main.innerHTML = `
        <section>
            <h2 class="sr-only">회원가입 화면</h2>
            <ul class="sign-tabs">
                <li class="sign__tab-item active"><button type="button">구매회원가입</button></li>
                <li class="sign__tab-item"><button type="button">판매회원가입</button></li>
            </ul>

            <form class="signup-form">
                ${createFieldset({
                    id: 'userId',
                    label: '아이디',
                    type: 'text',
                    extraHTML: `<button type="button" class="check-btn">중복확인</button>`,
                })}

                ${createFieldset({
                    id: 'password',
                    label: '비밀번호',
                    type: 'password',
                    img: true,
                })}

                ${createFieldset({
                    id: 'passwordConfirm',
                    label: '비밀번호 재확인',
                    type: 'password',
                    img: true,
                })}

                ${createFieldset({
                    id: 'userName',
                    label: '이름',
                    type: 'text',
                })}

                <fieldset class="form-group">
                    <label for="phone">휴대폰번호</label>
                    <div class="phone-wrapper">
                        <select id="phonePre" name="phonePre">
                        ${['010', '011', '016', '017', '018', '019'].map(v => `<option value="${v}">${v}</option>`).join('')}
                        </select>
                        <input type="tel" id="phoneMiddle" name="phoneMiddle" maxlength="4">
                        <input type="tel" id="phoneLast" name="phoneLast" maxlength="4">
                    </div>
                </fieldset>

                <fieldset class="form-group">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="terms" name="terms">
                        <label for="terms">
                            호두샵의 <a href="#none" class="link">이용약관</a> 및
                            <a href="#none" class="link">개인정보처리방침</a>에 대한 내용을 확인하였고 동의합니다.
                        </label>
                    </div>
                </fieldset>

                <button type="submit" class="signup-btn">가입하기</button>
            </form>
        </section>
    `;

    return main;
}

/**
 * 필드셋(입력폼 그룹) 마크업을 생성합니다.
 * @param {Object} params - 필드셋 생성 옵션
 * @param {string} params.id - input 요소의 id 및 name 속성 값
 * @param {string} params.label - 필드셋 라벨 텍스트
 * @param {string} params.type - input 타입 (e.g. text, password, tel 등)
 * @param {string} [params.extraHTML=''] - input 옆에 추가할 HTML (예: 버튼)
 * @param {boolean} [params.img=false] - 비밀번호 입력창의 체크 아이콘 포함 여부
 * @returns {string} 필드셋 HTML 문자열
 */
function createFieldset({ id, label, type, extraHTML = '', img = false }) {
    const wrapperClass = img ? 'input-wrapper pw' : 'input-wrapper';
    const imgHTML = img ? `<img src="./images/icon-check-off.svg" alt="" class="password-check">` : '';

    return `
        <fieldset class="form-group">
            <label for="${id}">${label}</label>
            <div class="${wrapperClass}">
                <input type="${type}" id="${id}" name="${id}">
                ${extraHTML}
                ${imgHTML}
            </div>
            <span class="input-message"></span>
        </fieldset>
    `;
}
