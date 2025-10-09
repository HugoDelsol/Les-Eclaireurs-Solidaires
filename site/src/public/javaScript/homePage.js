//SCROLLANIMATION

const imgScrollAnimationHeroSection = document.querySelector(".heroSectionCard");
const imgScrollAnimationAboutSection = document.querySelector(".aboutCard");

window.addEventListener("scroll", () => {
    imgScrollAnimationHeroSection.style.transform = "rotate(" + window.scrollY + "deg)";
    imgScrollAnimationAboutSection.style.transform = "rotate(" + window.scrollY + "deg)";
});












