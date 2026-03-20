// ==============================
// DISPLAY-PASSWORD-OR-NO
// ==============================

const imgSrc = document.querySelector('.imgSrc');
const inputPswd = document.querySelector('.password');

imgSrc.addEventListener('click', () => {
    
    if (imgSrc.attributes.src.nodeValue === "/pictures/globalIcons/closeEye.png") {
        
        imgSrc.attributes.src.nodeValue = "/pictures/globalIcons/openEye.png";
        imgSrc.attributes.alt.nodeValue = "Masquer le mot de passe";
        inputPswd.type = "text";
        
    } else if (imgSrc.attributes.src.nodeValue === "/pictures/globalIcons/openEye.png") {
        
        imgSrc.attributes.src.nodeValue = "/pictures/globalIcons/closeEye.png";
        imgSrc.attributes.alt.nodeValue = "Afficher le mot de passe";
        inputPswd.type = "password";
    }
});