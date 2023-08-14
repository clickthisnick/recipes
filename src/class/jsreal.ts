// ts thats converted to js

function removeAllClassNames(className: string) {
    const elements = document.getElementsByClassName(className);

    for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        element.className = ""
    }
}
