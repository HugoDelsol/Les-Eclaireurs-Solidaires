let isBelow1300 = window.innerWidth < 1300;
let currentWidth = window.innerWidth;

const alertFront = document.querySelector(".alertFront");

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

let indexRegion = 0;
let dataRegion = [];

async function carrouselMissionByRegion() {

    try {

        const response = await fetch("/fetchMissionByRegionDashboardUser", {
            method: "GET",
        }) 

        if (!response.ok) {
            const error = await response.json();
            alertFrontOfficeError.textContent = error.errorMsg            
            ifNoDataRegion.style.display = "none";
            return;
        }

        dataRegion = await response.json();

        dataRegion.forEach((m) => {
            const img = new Image();
            img.src = m.mission_img;
        });


        if (dataRegion.length == 0) {
            ifNoDataRegion.style.display = "none";
            return;
        }

        updateCarouselRegion();

    } catch (error) {

        console.log(error);
    }
}

function updateCarouselRegion() {
    missionTitle.textContent = dataRegion[indexRegion].mission_title;
    missionAvailablePlace.textContent = dataRegion[indexRegion].mission_available_place;
    backgroundImage.style.backgroundImage = `url('${dataRegion[indexRegion].mission_img}')`;
}

arrowRight.addEventListener('click', () => {

    indexRegion += 1;

    if (indexRegion == dataRegion.length) indexRegion = 0

    updateCarouselRegion();
});

arrowLeft.addEventListener('click', () => {

    indexRegion -= 1;

    if (indexRegion == -1) indexRegion = dataRegion.length - 1

    updateCarouselRegion();
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


let indexRegistration = 0;
let dataRegistration = [];

async function carrouselMissionByRegistration() {

    try {

        const response = await fetch('/fetchMissionByRegistrationDashboardUser', {
            method: "GET",
        })

        if (!response.ok) {
            const error = await response.json()
            alertFrontOfficeError.textContent = error.errorMsg
            ifNoDataRegister.style.display = "none";
            return;
        }

        dataRegistration = await response.json();

        if (dataRegistration.length == 0) {
            ifNoDataRegister.style.display = "none";
            return;
        }

        dataRegistration.forEach((m) => {
            const img = new Image();
            img.src = m.mission_img;
        });        

        updateCarrouselRegistration()

    } catch (error) {

        console.log(error);
    }
}

function updateCarrouselRegistration() {
    titleMissionRegister.textContent = dataRegistration[indexRegistration].mission_title;
    dateMissionRegister.textContent = `Lieu : ${dataRegistration[indexRegistration].city_name}`;
    backgroundImageRegister.style.backgroundImage = `url('${dataRegistration[indexRegistration].mission_img}')`
}

arrowRightRegistration.addEventListener('click', () => {

    indexRegistration += 1

    if (indexRegistration == dataRegistration.length) {
        indexRegistration = 0
    }

    updateCarrouselRegistration()
})

arrowLeftRegistration.addEventListener('click', () => {

    indexRegistration -= 1

    if (indexRegistration == -1) {
        indexRegistration = dataRegistration.length - 1
    }
    updateCarrouselRegistration()
})

/* --- */
/* --- CAROUSSEL MISSION ACCOMPLISHED --- */
/* --- */

const ifNoDataAccomplished = document.querySelector('.ifNoDataAccomplished');
const arrowLeftAccomplished = document.querySelector('.arrowLeftAccomplished');
const arrowRightAccomplished = document.querySelector('.arrowRightAccomplished');

const titleMissionAccomplished = document.querySelector(".title-mission-accomplished");
const dateMissionAccomplished = document.querySelector(".date-mission-accomplished");
const imgAccomplished = document.querySelector(".imgAccomplished");

let indexAccomplished = 0;
let dataAccomplished = [];

async function carrouselMissionAccomplished() {

    try {

        const response = await fetch('fetchMissionAccomplishedDashboardUser', {
            method: "GET",
        })

        if (!response.ok) {
            const error = await response.json()
            alertFrontOfficeError.textContent = error.errorMsg;            
            ifNoDataAccomplished.style.display = "none";
            return;
        }

        dataAccomplished = await response.json();

        dataAccomplished.forEach((m) => {
            const img = new Image();
            img.src = m.mission_img;
        });

        if (dataAccomplished.length == 0) {
            ifNoDataAccomplished.style.display = "none";
            return;
        }

        updateCarrouselAccomplished()

    } catch (error) {

        console.log(error);
    }
}

function updateCarrouselAccomplished() {
    titleMissionAccomplished.textContent = dataAccomplished[indexAccomplished].mission_title;
    dateMissionAccomplished.textContent = dataAccomplished[indexAccomplished].mission_date;
    imgAccomplished.style.backgroundImage = `url('${dataAccomplished[indexAccomplished].mission_img}')`
}

arrowRightAccomplished.addEventListener('click', () => {

    indexAccomplished += 1;

    if (indexAccomplished > dataAccomplished.length - 1) {
        indexAccomplished = 0
    }

    updateCarrouselAccomplished()
})

arrowLeftAccomplished.addEventListener('click', () => {

    indexAccomplished -= 1;

    if (indexAccomplished == -1) {
        indexAccomplished = dataAccomplished.length - 1
    }

    updateCarrouselAccomplished()
})