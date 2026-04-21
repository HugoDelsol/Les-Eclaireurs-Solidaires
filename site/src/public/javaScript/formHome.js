//FORMDATA

const submitForm = document.querySelector("form");
const inputs = document.querySelectorAll("input");

const emailForm = document.querySelector("#email");
const nameForm = document.querySelector("#firstName");
const txtArea = document.querySelector("#txtArea");

const btnSubmit = document.querySelector(".btnSubmit");

btnSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    apiDataForm();
});

async function apiDataForm() {

    try {

        const dataForm = {
            "nameForm": nameForm.value,
            "emailForm": emailForm.value,
            "txtArea": txtArea.value
        }

        const response = await fetch("/homeForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataForm)
        })

        const jsonResult = await response.json();

        let valueClass;
        let valueMsg;

        if (!response.ok) {

            if (jsonResult.mdlError) {
                valueClass = alertFrontOfficeError;
                valueMsg = jsonResult.mdlError;
            }

            if (jsonResult.messageErrorIsTrue) {
                valueClass = alertFrontOfficeError;
                valueMsg = jsonResult.messageError;
            }
        }

        if (jsonResult.messageSuccessIsTrue) {
            valueClass = alertFrontOfficeSuccess;
            valueMsg = jsonResult.messageSuccesss;
            inputs.forEach(el => {
                el.value = "";
                txtArea.value = "";
            });
        }

        valueClass.textContent = valueMsg;

    } catch (error) {

        alertFrontOfficeError.textContent = "Connexion au serveur impossible.";
    }
}








