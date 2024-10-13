const closeBtn = document.querySelector('.close-btn');
const asideElement = document.querySelector('aside');

closeBtn.addEventListener('click', () => {
    asideElement.style.display = 'none';
})