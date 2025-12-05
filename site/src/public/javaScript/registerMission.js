const checkBox = document.querySelectorAll('.checkbox');
const idUser = document.querySelector(".idUser");

const idUserValue = parseInt(idUser.textContent)

for (let c of checkBox) {

    c.addEventListener('click', () => {
        const dataParse = JSON.parse(c.dataset.id)

        const idMission = dataParse.id;
        const titleMission = dataParse.title;

        modalRegisterMission(c, idMission, titleMission);
        //console.log(idUser)
    })
}

async function modalRegisterMission(c, idMission, titleMission) {

    if (c.checked) {

        const response = await fetch("/modalRegisterMission", {
            method: "GET",
        });

        if (!response.ok) {

            window.location.href = "/";
            console.log(data.message)
        }

        const htmlResponse = await response.text();
        document.querySelector(".modalContain").innerHTML = htmlResponse

        const btnClose = document.querySelector(".close");
        const btnSubscribe = document.querySelector(".subscribe");
        const span = document.querySelector('span');  

        const modal = document.querySelector(".modal")
        const modalToggle = document.querySelector(".modalToggle");
        
        span.textContent = titleMission;
        span.classList.add("spanText")

        btnClose.addEventListener("click", () => {
            document.querySelector('.modalContain').innerHTML = ""
            c.checked = false
        })

        btnSubscribe.addEventListener("click", async () => {
            const response = await fetch(`/addRegisterMissionUser?idMission=${idMission}&idUser=${idUserValue}`, {
                method: "POST"
            });

            if (!response.ok) {
                window.location.href = "/";
                console.log(data.message)
            }

            const data = await response.json();

            if (!data.alreadyAdded) {

                modal.classList.toggle('toggleNone');
                modalToggle.classList.toggle('toggleBlock');

                setTimeout(()=>{
                    document.querySelector('.modalContain').innerHTML = ""
                    c.checked = false
                    location.reload()
                }, 3000);   
                
                
            }

        });

    }
}
