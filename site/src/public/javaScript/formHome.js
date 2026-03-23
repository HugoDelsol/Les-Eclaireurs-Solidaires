//FORMDATA
const submitForm = document.querySelector("form");
const input = document.querySelectorAll("input");

const emailForm = document.querySelector("#email");
const nameForm = document.querySelector("#firstName");
const txtArea = document.querySelector("#txtArea");

const btnSubmit = document.querySelector(".btnSubmit");

for (let i = 0; i < input.length; i++) {

    input[i].value = "";
    txtArea.value = "";
}

btnSubmit.addEventListener("click", function (event) {

    event.preventDefault();

    if (
        nameForm.value == "" ||
        emailForm.value == "" ||
        txtArea.value == ""
    ) {

        alertFrontOfficeError.textContent = "Veuillez compléter tous les champs.";

    } else {

        apiDataForm();

        input[0].value = "";
        input[1].value = "";
        txtArea.value = "";
    }

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
        
        if (!response.ok) {
            throw new Error('Erreur');
        }

        const jsonResult = await response.json();

        console.log(jsonResult)

        let valueClass;
        let valueMsg;

        if (jsonResult.mdlError) {
            valueClass = alertFrontOfficeError;
            valueMsg = jsonResult.mdlError;
        }
        if (jsonResult.messageSuccessIsTrue) {
            valueClass = alertFrontOfficeSuccess;
            valueMsg = jsonResult.messageSuccesss;
        }
        if (jsonResult.messageErrorIsTrue) {
            valueClass = alertFrontOfficeError;
            valueMsg = jsonResult.messageError;
            nameForm.value = jsonResult.data.nameForm;
            emailForm.value = jsonResult.data.emailForm;
            txtArea.value = jsonResult.data.txtArea;
        }        

        valueClass.textContent = valueMsg;        

    } catch (error) {

        console.log("Erreur apiDataForm : ", error);
    }
}








