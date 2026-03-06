window.addEventListener("load", () => {
    
    const screens = document.querySelectorAll(".mainBackOffice, .mainFrontOffice");
    
    screens.forEach((s) => {
        s.classList.add("isVisible");
    })
}) 