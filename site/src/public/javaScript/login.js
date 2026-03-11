const similarPassword = document.querySelector('#password');
const similarPasswordConfirm = document.querySelector('#passwordConfirm');

const inputValue = document.querySelectorAll('input');

function verifPassword() {

    if (similarPassword.value === "" || similarPasswordConfirm.value === "") {

        similarPassword.style.boxShadow = "none"
        similarPasswordConfirm.style.boxShadow = "none"

    } else if (similarPassword.value !== "" && similarPassword.value === similarPasswordConfirm.value) {

        similarPasswordConfirm.style.boxShadow = "0px 0px 24px rgba(0, 128, 0, 0.5)"

    } else if
        (similarPassword.value !== similarPasswordConfirm.value &&
        similarPassword.value !== "" &&
        similarPasswordConfirm.value !== "") {

        similarPasswordConfirm.style.boxShadow = "0px 0px 24px rgba(128, 0, 17, 0.5)"
    }
}

similarPassword.addEventListener("input", verifPassword);
similarPasswordConfirm.addEventListener("input", verifPassword);









