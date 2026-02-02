//FORMDATA

const submitForm = document.querySelector("form");
const input = document.querySelectorAll("input");

const emailForm = document.querySelector("#email");
const nameForm = document.querySelector("#firstName");
const txtArea = document.querySelector("#txtArea");

const alertForm = document.querySelector(".alertForm")

const btnSubmit = document.querySelector(".btnSubmit");

for (let i = 0; i < input.length; i++) {

    input[i].value = "";
    txtArea.value = "";

}

btnSubmit.addEventListener("click", function (event) {

    event.preventDefault();

    console.log('test')

    if (
        nameForm.value == "" ||
        emailForm.value == "" ||
        txtArea.value == ""
    ) {

        alertForm.textContent = "Veuillez compléter tous les champs.";

    } else {

        apiDataForm();

        alertForm.textContent = "";

        console.log("SUCCESS");

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

        const jsonResult = await response.json();

        alertForm.textContent = jsonResult.message;

        if (!response.ok) {
            throw new Error('Erreur');
        }

    } catch (error) {

        console.log("Erreur :", error);
    }
}








