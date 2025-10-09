let btnDropDownList = document.querySelectorAll("h2");

let arrowDown = document.querySelectorAll(".arrowDown");
let arrowUp = document.querySelectorAll(".arrowUp");

for (let i = 0; i < btnDropDownList.length; i++) {

    btnDropDownList[i].addEventListener("click", () => {

        let next = btnDropDownList[i].nextElementSibling;
        next.classList.toggle("displayNone");
        arrowDown[i].classList.toggle("displayNone");
        arrowUp[i].classList.toggle("displayNone");
    });
}
