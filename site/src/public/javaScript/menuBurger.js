//MENUBURGER

function menuBurgerTranslate() {

    const btnMenuBurgerShow = document.querySelector(".menuBurger");
    const btnMenuBurgerCross = document.querySelector(".menuBurgerCross");

    const hiddenList = document.querySelector(".hiddenList");

    btnMenuBurgerShow.addEventListener("click", () => {
        document.body.style.overflow = "hidden";
        hiddenList.style.transform = "translateX(-0%)";
        btnMenuBurgerCross.style.display = "block";
        btnMenuBurgerShow.style.display = "none";
    })

    btnMenuBurgerCross.addEventListener("click", () => {
        document.body.style.overflow = "scroll";
        hiddenList.style.transform = "translateX(-110%)";
        btnMenuBurgerCross.style.display = "none";
        btnMenuBurgerShow.style.display = "block";
    })
}

menuBurgerTranslate();