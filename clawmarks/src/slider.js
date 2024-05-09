document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.carousel .images img');
    let currentImgIndex = 0;

    function showCurrentImg() {
        images.forEach((img, index) => {
            img.style.display = index === currentImgIndex ? 'block' : 'none';
        });
    }

    document.querySelector('.carousel .prev').addEventListener('click', () => {
        currentImgIndex = currentImgIndex > 0 ? currentImgIndex - 1 : images.length - 1;
        showCurrentImg();
    });

    document.querySelector('.carousel .next').addEventListener('click', () => {
        currentImgIndex = currentImgIndex < images.length - 1 ? currentImgIndex + 1 : 0;
        showCurrentImg();
    });

    showCurrentImg();
});
