const btnAddOpinion = document.querySelectorAll('.addOpinion');
const modalContainOpinion = document.querySelector('.modalContainOpinion');
const textarea = document.querySelector('#userOpinion');
const sendOpinion = document.querySelector('.sendOpinion');

btnAddOpinion.forEach(el => {
    el.addEventListener('click', (event) => {
        event.preventDefault();
        modalContainOpinion.style.display = "flex"
    })
});

modalContainOpinion.addEventListener('click', (e) => {
    if (e.target === modalContainOpinion) {
        closeModal()
    }
});

sendOpinion.addEventListener('click', (event) => {
    event.preventDefault()
    const conf = confirm("Êtes-vous sûr de vouloir envoyer votre avis ?")
    if (conf) { sendUserOpinion() }
});

function closeModal() {
    modalContainOpinion.style.display = "none";
}

async function sendUserOpinion() {

    try {

        const dataOpinion = {
            textContent: textarea.value,
        }

        const response = await fetch('/userOpinion', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataOpinion)
        })

        if (!response.ok) {
            throw new Error('Erreur');
        }

        const jsonResult = await response.json();

        let valueClass;
        let valueMsg;

        if (jsonResult.mdlError) {
            valueClass = alertFrontOfficeError;
            valueMsg = jsonResult.mdlError
        }
        if (jsonResult.messageErrorIsTrue) {
            valueClass = alertFrontOfficeError;
            valueMsg = jsonResult.messageError
        }
        if (jsonResult.messageSuccessIsTrue) {
            valueClass = alertFrontOfficeSuccess;
            valueMsg = jsonResult.messageSuccesss;
            textarea.value = "";
            closeModal();
        }

        valueClass.textContent = valueMsg;

    } catch (error) {

        console.log("Erreur sendUserOpinion : ", error);
    }
}

