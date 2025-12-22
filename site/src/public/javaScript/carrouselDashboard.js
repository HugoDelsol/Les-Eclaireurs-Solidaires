const arrowRight = document.querySelector(".arrowRight");
const arrowLeft = document.querySelector(".arrowLeft");

const loadingMission = document.querySelector(".rowArrow");
const carrouselStyle = document.querySelector(".carrouselStyle");

const missionTitle = document.querySelector(".mission_title");
const cityName = document.querySelector(".city_name");
const missionAvailablePlace = document.querySelector(".mission_available_place");

let isBelow1300 = window.innerWidth < 1300;
let currentWidth = window.innerWidth;

if (currentWidth < 1300) {
    carrouselMissionByRegion()
}

window.addEventListener('resize', () => {

    currentWidth = window.innerWidth

    if (currentWidth >= 1300 && isBelow1300) {
        isBelow1300 = false;
    }

    if (currentWidth < 1300 && !isBelow1300) {
        isBelow1300 = true;
        carrouselMissionByRegion(isBelow1300);
    }
})

async function carrouselMissionByRegion() {

    try {

        const response = await fetch("/fetchMissionByRegionDashboardUser", {
            method: "GET",
        })

        if (!response.ok) {
            window.location.href = "/";
            console.log(data.message);
            return;
        }

        const data = await response.json();

        let index = 0;

        if (data.length < 0 ) {

            loadingMission.style.display = "none"
            return;

        } else {

            function updateCarrousel() {
                missionTitle.textContent = data[index].mission_title;
                cityName.textContent = data[index].city_name;
                missionAvailablePlace.textContent = data[index].mission_available_place;
            }

            arrowRight.addEventListener('click', () => {

                index += 1;

                if (index == data.length) index = 0
                
                //carrouselStyle.classList.toggle('carrouselStyleToogleRight')
                
                updateCarrousel();                
                
            })
            
            arrowLeft.addEventListener('click', () => {
                
                index -= 1;
                
                if (index == -1) index = data.length - 1
                
                //carrouselStyle.classList.toggle('carrouselStyleToogleLeft')
                updateCarrousel();
            })

            updateCarrousel();
        }

    } catch (error) {

        console.error(error);
    }

}
