const footerHTML = `
    <section class="footer-top">
        <h2 class="sr-only">푸터 메뉴, 소셜미디어 링크</h2>
        <nav class="footer-nav" aria-label="푸터 메뉴">
            <ul>
                <li><a href="#none">호두샵 소개</a></li>
                <li><a href="#none">이용약관</a></li>
                <li><a href="#none">개인정보처리방침</a></li>
                <li><a href="#none">전자금융거래약관</a></li>
                <li><a href="#none">청소년보호정책</a></li>
                <li><a href="#none">제휴문의</a></li>
            </ul>
        </nav>
        <nav class="footer-sns" aria-label="소셜미디어">
            <ul>
                <li><a href="#none"><img src="./images/icon-insta.svg" alt="인스타그램"></a></li>
                <li><a href="#none"><img src="./images/icon-fb.svg" alt="페이스북"></a></li>
                <li><a href="#none"><img src="./images/icon-yt.svg" alt="유튜브"></a></li>
            </ul>
        </nav>
    </section>
    <address class="footer-info">
        <p class="company-name">(주)HODU SHOP</p>
        <p>제주특별자치도 제주시 동광고 137 제주코딩베이스캠프</p>
        <p>사업자 번호:000-0000-0000 | 통신판매업</p>
        <p>대표:김호두</p>
    </address>
`;

document.querySelector('#gnb-footer').innerHTML = footerHTML;
