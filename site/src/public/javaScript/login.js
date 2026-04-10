const similarPassword = document.querySelector('#password');
const similarPasswordConfirm = document.querySelector('#passwordConfirm');

const inputValue = document.querySelectorAll('input');

const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/

function verifPassword() {

    let password = this.value;

    if (similarPassword.value !== "" && similarPassword.value === similarPasswordConfirm.value && reg.test(password)) {

        similarPasswordConfirm.style.boxShadow = "0px 0px 24px rgba(0, 128, 0, 0.7)"

    } else if ( similarPassword.value !== similarPasswordConfirm.value && !reg.test(password)) {

        similarPasswordConfirm.style.boxShadow = "0px 0px 24px rgba(128, 0, 17, 0.7)"
    }
}

similarPassword.addEventListener("input", verifPassword);
similarPasswordConfirm.addEventListener("input", verifPassword);









