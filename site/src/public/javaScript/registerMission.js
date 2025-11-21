const checkBox = document.querySelectorAll('.checkbox');
const idUser = document.querySelector(".idUser");

const idUserValue = parseInt(idUser.textContent)

for (let c of checkBox) {

    c.addEventListener('click', () => {
        console.log(c.dataset);
        registerMissionUser(c);
        //console.log(idUser)
    })
}

async function registerMissionUser(c) {

    try {

        if (c.checked) {

            const response = await fetch(`/registerMissionUser?idMission=${c.dataset.id}&idUser=${idUserValue}`, {
                method: "GET"
            })

            const data = await response.json();

            if (!response.ok) {
                window.location.href = "/";
                console.log(data.message)
            }
        }

    } catch (error) {
        console.error('Erreur:', error);
    }
}