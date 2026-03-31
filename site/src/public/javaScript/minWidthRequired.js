const minWidth = 1366;
const currentWidth = window.innerWidth;
const homeUrl = window.location.origin;

if (currentWidth <= minWidth) {
    document.body.style.display = "none"
    alert("Format d'affichage non supporté : Désolé, votre écran est trop étroit pour accéder au Back Office.");
    window.location.href = homeUrl;
}

/* 
let test;

function minWidthRequired(currentWidth, minWidth) {

    window.addEventListener('resize', () => {

        if (window.innerWidth <= minWidth) {
            currentWidth = window.innerWidth
            test = true;
        }

        if (window.innerWidth >= minWidth && test === true) {
            currentWidth = window.innerWidth
            console.log("test")
        }
    })

    if (currentWidth <= minWidth) {
        document.body.style.display = "none"
        alert("Format d'affichage non supporté : Désolé, votre écran est trop étroit pour accéder au Back Office.");
        window.location.href = homeUrl;
    }
}
minWidthRequired(currentWidth, minWidth) */
