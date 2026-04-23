const checkBox = document.querySelectorAll('.checkbox');
const btnRegistration = document.querySelectorAll('.btnRegistration')
const idUser = document.querySelector(".idUser");

const idUserValue = parseInt(idUser.textContent);

for (let c of checkBox) {

    c.addEventListener('click', () => {

        const dataParse = JSON.parse(c.dataset.id);

        const idMission = dataParse.id;
        const titleMission = dataParse.title;

        modalRegisterMission(c, "", idMission, titleMission);
    })
}

for (let b of btnRegistration) {

    b.addEventListener("click", (e) => {

        e.preventDefault();

        const dataParse = JSON.parse(b.dataset.id);

        const idMission = dataParse.id;
        const titleMission = dataParse.title;

        modalRegisterMission("", b, idMission, titleMission);
    })
}

async function modalRegisterMission(c, b, idMission, titleMission) {

    if (c.checked || b.classList.contains("btnRegistration")) {

        const response = await fetch("/modalRegisterMission", {
            method: "GET",
        });

        if (!response.ok) {
            alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant.";            
            return;
        }

        const htmlResponse = await response.text();

        const cleanHtml = DOMPurify.sanitize(htmlResponse);

        document.querySelector(".modalContain").innerHTML = cleanHtml;

        const btnClose = document.querySelector(".close");
        const btnSubscribe = document.querySelector(".subscribe");
        const span = document.querySelector('span');

        const modal = document.querySelector(".modal")
        const modalToggle = document.querySelector(".modalToggle");

        span.textContent = titleMission;
        span.classList.add("spanText")

        btnClose.addEventListener("click", () => {

            document.querySelector('.modalContain').textContent = "";
            c.checked = false;
        })

        btnSubscribe.addEventListener("click", async () => {

            const response = await fetch(`/addRegisterMissionUser?idMission=${idMission}&idUser=${idUserValue}`, {
                method: "POST"
            });

            if (!response.ok) {
                alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant."
                return;
            }

            const data = await response.json();

            if (!data.alreadyAdded && !data.message) {

                modal.classList.toggle('toggleNone');
                modalToggle.classList.toggle('toggleBlock');

                setTimeout(() => {
                    document.querySelector('.modalContain').textContent = "";
                    c.disabled = true;
                }, 3000);

            } else {

                document.querySelector('.alertFrontOfficeError').textContent = data.message;
                c.checked = false;

                setTimeout(() => {
                    document.querySelector('.modalContain').textContent = "";
                    c.checked = false;
                }, 3000);
            }
        });

    } else {

        alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant.";
    }
}
