document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');

    function showImageName(event) {
        const imageName = event.target.alt;
        const imageNameElement = document.createElement('p');
        imageNameElement.textContent = imageName;
        logo.insertAdjacentElement('afterend', imageNameElement);
    }

    function hideImageName() {
        const imageNameElement = document.querySelector('.image-name');
        if (imageNameElement) {
            imageNameElement.remove();
        }
    }

    image1.addEventListener('mouseenter', showImageName);
    image1.addEventListener('mouseleave', hideImageName);
    image2.addEventListener('mouseenter', showImageName);
    image2.addEventListener('mouseleave', hideImageName);
});
