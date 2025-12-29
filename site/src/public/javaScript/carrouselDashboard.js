let isBelow1300 = window.innerWidth < 1300;
let currentWidth = window.innerWidth;

if (currentWidth < 1300) {
    carrouselMissionByRegion();
    carrouselMissionByRegistration();
}

window.addEventListener('resize', () => {

    currentWidth = window.innerWidth

    if (currentWidth >= 1300 && isBelow1300) {
        isBelow1300 = false;
    }

    if (currentWidth < 1300 && !isBelow1300) {
        isBelow1300 = true;
        carrouselMissionByRegion();
        carrouselMissionByRegistration();
    }
})

const ifNoData = document.querySelector(".rowArrow");

/* --- CAROUSSEL BY REGIONS --- */

const arrowRight = document.querySelector(".arrowRight");
const arrowLeft = document.querySelector(".arrowLeft");

const missionTitle = document.querySelector(".mission-title");
const cityName = document.querySelector(".city-name");
const missionAvailablePlace = document.querySelector(".mission-available-place");

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

        if (data.length < 0) {

            ifNoData.style.display = "none"
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

                updateCarrousel();
            })

            arrowLeft.addEventListener('click', () => {

                index -= 1;

                if (index == -1) index = data.length - 1

                updateCarrousel();
            })

            updateCarrousel();
        }

    } catch (error) {

        console.log(error);
    }
}

/* --- CAROUSSEL BY REGISTRATION --- */

const arrowLeftRegistration = document.querySelector(".arrowLeftRegistration");
const arrowRightRegistration = document.querySelector(".arrowRightRegistration");

const titleMissionRegister = document.querySelector(".title-mission-register");
const placeMissionRegister = document.querySelector(".place-mission-register");
const dateMissionRegister = document.querySelector(".date-mission-register");

async function carrouselMissionByRegistration() {

    try {

        const response = await fetch('/fetchMissionByRegistrationDashboardUser', {
            method: "GET",
        })

        if (!response.ok) {
            window.location.href = "/";
            console.log(data.message);
            return;
        }

        const data = await response.json();

        let index = 0

        function updateCarrousel() {
            titleMissionRegister.textContent = data[index].mission_title;
            placeMissionRegister.textContent = data[index].city_name;
            dateMissionRegister.textContent = data[index].mission_date;
        }

        arrowLeftRegistration.addEventListener('click', () => {

            index -= 1

             if (index == -1) {
                index = data.length - 1
            }            
            updateCarrousel()
            
        })

        arrowRightRegistration.addEventListener('click', () => {

            index += 1

            if (index == data.length) {
                index = 0
            }
            
            updateCarrousel()
        })

        updateCarrousel()

    } catch (error) {

        console.log(error);
    }
}
