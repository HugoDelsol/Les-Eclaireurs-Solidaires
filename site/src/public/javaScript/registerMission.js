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
            });

            if (!response.ok) {
                window.location.href = "/";
                console.log(data.message)
            }

            const htmlResponse = await response.text();

            //console.log(htmlResponse);

            document.querySelector(".modalContain").innerHTML = htmlResponse

            if (document.querySelector(".close").addEventListener("click", () => {
                document.querySelector('.modalContain').innerHTML = ""
                c.checked = false
            }));

            if (document.querySelector('subscribe').addEventListener('click', () => {

            }));

        }

    } catch (error) {
        console.error('Erreur:', error);
    }
}