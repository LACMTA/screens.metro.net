// on dom load
document.addEventListener("DOMContentLoaded", function() {
    let imageArray = document.querySelector("#image-container");
    let duration = imageArray.getAttribute("data-duration");

    // every duration seconds, cycle through the imageArray to toggle visibility
    setInterval(function() {
        // Get the first element in the imageArray
        let firstElement = imageArray.firstElementChild;
        imageArray.removeChild(firstElement);

        firstElement.classList.add('hide');
        firstElement.classList.remove('show');

        imageArray.appendChild(firstElement);

        firstElement = imageArray.firstElementChild;
        firstElement.classList.add('show');
        firstElement.classList.remove('hide');
    }, duration * 1000);

});