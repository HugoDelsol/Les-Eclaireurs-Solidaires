//FORMDATA

const submitForm = document.querySelector("form");
const input = document.querySelectorAll("input");

const emailForm = document.querySelector("#email");
const nameForm = document.querySelector("#firstName");
const txtArea = document.querySelector("#txtArea");

const alertForm = document.querySelector(".alert")

const btnSubmit = document.querySelector(".btnSubmit");

for (let i = 0; i < input.length; i++) {

    input[i].value = "";
    txtArea.value = "";

}

submitForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (
        nameForm.value == "" ||
        emailForm.value == "" ||
        txtArea.value == ""
    ) {

        alertForm.innerHTML = "<p style='margin-top: 1em ; color: red; '>Veuillez compléter tous les champs.</p>";

        console.log("ERROR");

    } else {
        
        apiDataForm();

        btnSubmit.textContent = "Message envoyé ! ✅"

        alertForm.innerHTML = "";        

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

        console.log(dataForm);

        const response = await fetch("/homeForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataForm)
        })

        if (!response.ok) {
            throw new Error('Erreur');
        }

    } catch (error) {

        console.log("Erreur :", error);
    }
}








