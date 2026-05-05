const password = document.querySelector('#password');
const passwordConfirm = document.querySelector('#passwordConfirm');

const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

function verifPassword() {

    const regexValid = reg.test(password.value);
    const samePassword = password.value === passwordConfirm.value;

    if (password.value === "" || passwordConfirm.value === "") {

        passwordConfirm.style.boxShadow = "none";
        
        return;
    }

    if (samePassword && regexValid) {

        passwordConfirm.style.boxShadow = "0px 0px 24px rgba(0, 128, 0, 0.7)";

    } else {

        passwordConfirm.style.boxShadow = "0px 0px 24px rgba(128, 0, 17, 0.7)";
    }
}

password.addEventListener("input", verifPassword);
passwordConfirm.addEventListener("input", verifPassword);









