// check for url params passed to this page upon page load

document.addEventListener('DOMContentLoaded', function() {
    getUrlParam('preview');
});

function getUrlParam(paramName) {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(paramName)) {
        console.log(`${paramName}: ${urlParams.get(paramName)}`);
    } else {
        console.log('No url params found');
    }
}
