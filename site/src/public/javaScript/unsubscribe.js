const btnResponsiv = document.querySelector('.btnUnsubscribe');
const checkBox = document.querySelectorAll('.checkbox');
const idUser = document.querySelector('.idUser');
const idUserValue = parseInt(idUser.textContent);

for (let c of checkBox) {

    const dataParse = JSON.parse(c.dataset.id);
    const dataId = dataParse.id;
    const dataTitle = dataParse.title;

    c.addEventListener('click', () => {
        modalUnsubscriveMission(c, "", dataId, dataTitle);
    });
}

btnResponsiv.addEventListener('click', () => {

    const dataParse = JSON.parse(btnUnsubscribe.dataset.id)
    const dataId = dataParse.id;
    const dataTitle = dataParse.title;

    modalUnsubscriveMission("", btnResponsiv, dataId, dataTitle);
});

async function modalUnsubscriveMission(c, btnResponsiv, dataId, dataTitle) {

    if (c.checked || btnResponsiv.classList.contains("btnUnsubscribe")) {

        const response = await fetch('modalUnsubscribeMission', {
            method: 'GET',
        })

        if (!response.ok) {
            alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant."
            return;
        }

        const htmlResponse = await response.text();
        const cleanHtml = DOMPurify.sanitize(htmlResponse)
        document.querySelector('.modalContain').innerHTML = cleanHtml;

        const btnClose = document.querySelector('.close');
        const btnUnsubscribeConfirmation = document.querySelector('.btnUnsubscribeConfirmation');
        const span = document.querySelector('span');
        const modal = document.querySelector(".modal")
        const modalToggle = document.querySelector(".modalToggle");

        span.textContent = dataTitle;
        span.classList.add("spanText")

        btnClose.addEventListener('click', () => {
            document.querySelector('.modalContain').textContent = "";
            c.checked = false;
        })

        btnUnsubscribeConfirmation.addEventListener('click', async () => {

            const response = await fetch(`/unregisterAVolunteer?idRegistration=${dataId}&idUser=${idUserValue}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant.";
                c.checked = false;
                return;
            }

            const data = await response.json();

            if (!data.registrationDeleted) {

                document.querySelector('.alertFrontOfficeError').textContent = data.message;

                setTimeout(() => {

                    if (window.innerWidth < 1301) {
                        location.reload();
                    }

                    document.querySelector('.modalContain').textContent = "";
                    c.checked = false;

                }, 3000);

            } else {

                modal.classList.toggle('toggleNone');
                modalToggle.classList.toggle('toggleBlock');

                setTimeout(() => {

                    if (window.innerWidth < 1301) {
                        location.reload();
                    }

                    document.querySelector('.modalContain').textContent = "";
                    c.disabled = true;

                }, 3000);
            }
        });

    } else {

        alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant.";
    }
}




