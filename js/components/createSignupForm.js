// components/createSignupForm.js
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

                ${type === 'seller' ? `
                    ${createFieldset({
                        id: 'businessNumber',
                        label: '사업자 등록번호',
                        type: 'text',
                        extraHTML: `<button type="button" class="verify-btn">인증</button>`
                    })}

                    ${createFieldset({
                        id: 'storeName',
                        label: '스토어 이름',
                        type: 'text'
                    })}
                    ` : ''}

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
