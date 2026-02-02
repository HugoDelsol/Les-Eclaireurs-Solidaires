const btnSideNav = document.querySelectorAll(".btnNav");

btnSideNav.forEach((btn) => {

    if (btn.href === window.location.href) {

        btn.style.border = "1px solid black";
        btn.style.borderBottomRightRadius = "5px ";
        btn.style.borderTopLeftRadius = "5px ";
    }
})
