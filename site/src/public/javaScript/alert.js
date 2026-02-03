const alertMsgBack = document.querySelector(".alert");
const alertFrontOfficeSuccess = document.querySelector(".alertFrontOfficeSuccess");
const alertFrontOfficeError = document.querySelector(".alertFrontOfficeError");

if (window.innerWidth < 1300) {
    alertMsgBack.style.bottom = "100px"
    alertFrontOfficeSuccess.style.bottom = "100px"
    alertFrontOfficeError.style.bottom = "100px"
}

if (alertMsgBack.innerText.length > 0) {

    console.log("test")

    alertMsgBack.style.transform = "translateX(102vw)";

    setTimeout(() => {
        alertMsgBack.style.transform = "translateX(-100vw)";
    }, 5000);
}

const observer = new MutationObserver(m => {

    let value = null

    if (m[0].target.classList[0] === "alertFrontOfficeError") {

        value = alertFrontOfficeError;

    } else if (m[0].target.classList[0] === "alertFrontOfficeSuccess") {

        value = alertFrontOfficeSuccess;

    }

    value.style.transform = "translateX(102vw)";

    setTimeout(() => {

        value.style.transform = "translateX(-100vw)";

    }, 5000);
})

observer.observe(alertFrontOfficeError, {
    childList: true
})
observer.observe(alertFrontOfficeSuccess, {
    childList: true
})