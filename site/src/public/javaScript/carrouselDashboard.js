let isBelow1300 = window.innerWidth < 1300;
let currentWidth = window.innerWidth;

let indexRegion = 0;
let dataRegion = [];

const indexRegistration = 0;
const dataRegistration = [];

const indexAccomplished = 0;
const dataAccomplished = [];

if (currentWidth < 1300) {
    carrouselMissionByRegion();
    carrouselMissionByRegistration();
    carrouselMissionAccomplished();
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
        carrouselMissionAccomplished();
    }
})

/* --- */
/* --- CAROUSSEL BY REGIONS --- */
/* --- */

const ifNoDataRegion = document.querySelector(".ifNoDataRegion");
const arrowRight = document.querySelector(".arrowRight");
const arrowLeft = document.querySelector(".arrowLeft");

const missionTitle = document.querySelector(".mission-title");
const missionAvailablePlace = document.querySelector(".mission-available-place");
const backgroundImage = document.querySelector(".imgRegion");

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

        dataRegion = await response.json();

        dataRegion.forEach((m) => {
            const img = new Image();
            img.src = m.mission_img;
        });


        if (dataRegion.length == 0) {

            ifNoData.style.display = "none";
            return;
        }


        updateCarrousel();

    } catch (error) {

        console.log(error);
    }
}

function updateCarrousel() {
    missionTitle.textContent = dataRegion[indexRegion].mission_title;
    missionAvailablePlace.textContent = dataRegion[indexRegion].mission_available_place;
    backgroundImage.style.backgroundImage = `url('${dataRegion[indexRegion].mission_img}')`;
}

arrowRight.addEventListener('click', () => {

    indexRegion += 1;

    if (indexRegion == dataRegion.length) indexRegion = 0

    updateCarrousel();
});

arrowLeft.addEventListener('click', () => {

    indexRegion -= 1;

    if (indexRegion == -1) indexRegion = dataRegion.length - 1

    updateCarrousel();
});

/* --- */
/* --- CAROUSSEL BY REGISTRATION --- */
/* --- */

const ifNoDataRegister = document.querySelector(".ifNoDataRegister");
const arrowLeftRegistration = document.querySelector(".arrowLeftRegistration");
const arrowRightRegistration = document.querySelector(".arrowRightRegistration");

const titleMissionRegister = document.querySelector(".title-mission-register");
const dateMissionRegister = document.querySelector(".date-mission-register");
const backgroundImageRegister = document.querySelector(".imgRegister");

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

        data.forEach( (m) => {
            const img = new Image();
            img.src = m.mission_img;
        });

        let index = 0

        if (data.length == 0) {

            ifNoDataRegister.style.display = "none";
            return;
        }

        function updateCarrousel() {
            titleMissionRegister.textContent = data[index].mission_title;
            dateMissionRegister.textContent = `Lieu : ${data[index].city_name}`;
            backgroundImageRegister.style.backgroundImage = `url('${data[index].mission_img}')`
        }

        arrowRightRegistration.addEventListener('click', () => {

            index += 1

            if (index == data.length) {
                index = 0
            }

            updateCarrousel()
        })

        arrowLeftRegistration.addEventListener('click', () => {

            index -= 1

            if (index == -1) {
                index = data.length - 1
            }
            updateCarrousel()

        })

        updateCarrousel()

    } catch (error) {

        console.log(error);
    }
}

/* --- */
/* --- CAROUSSEL MISSION ACCOMPLISHED --- */
/* --- */

const ifNoDataAccomplished = document.querySelector('.ifNoDataAccomplished');
const arrowLeftAccomplished = document.querySelector('.arrowLeftAccomplished');
const arrowRightAccomplished = document.querySelector('.arrowRightAccomplished');

const titleMissionAccomplished = document.querySelector(".title-mission-accomplished");
const dateMissionAccomplished = document.querySelector(".date-mission-accomplished");
const imgAccomplished = document.querySelector(".imgAccomplished");

async function carrouselMissionAccomplished() {

    try {

        const response = await fetch('fetchMissionAccomplishedDashboardUser', {
            method: "GET",
        })

        if (!response.ok) {
            window.location.href = "/";
            console.log(data.message);
            return;
        }

        const data = await response.json();

        data.forEach( (m) => {
            const img = new Image();
            img.src = m.mission_img;
        });

        let index = 0

        if (data.length == 0) {

            ifNoDataAccomplished.style.display = "none";
            return;
        }

        function updateCarrousel() {
            titleMissionAccomplished.textContent = data[index].mission_title;
            dateMissionAccomplished.textContent = data[index].mission_date;
            imgAccomplished.style.backgroundImage = `url('${data[index].mission_img}')`
        }

        arrowRightAccomplished.addEventListener('click', () => {

            index += 1;

            if (index > data.length - 1) {
                index = 0
            }

            updateCarrousel()
        })

        arrowLeftAccomplished.addEventListener('click', () => {

            index -= 1;

            if (index == -1) {
                index = data.length - 1
            }

            updateCarrousel()
        })

        updateCarrousel()

    } catch (error) {

        console.log(error);
    }
}