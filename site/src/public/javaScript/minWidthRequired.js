const minWidth = 1366;
const currentWidth = window.innerWidth;
const homeUrl = window.location.origin;

if (currentWidth <= minWidth) {
    document.body.style.display = "none"
    alert("Format d'affichage non supporté : Désolé, votre écran est trop étroit pour accéder au Back Office.");
    window.location.href = `${homeUrl}/home`;
}
