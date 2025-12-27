// ts that's converted to js

function removeAllClassNames(className: string) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        element.className = '';
    });
}
