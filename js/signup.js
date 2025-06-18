const tabItems = document.querySelectorAll('.sign__tab-item');

tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => {
    tabItems.forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
    });
});
