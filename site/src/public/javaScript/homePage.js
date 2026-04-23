//SCROLLANIMATION

const imgScrollAnimationHeroSection = document.querySelector(".heroSectionCard");
const imgScrollAnimationAboutSection = document.querySelector(".aboutCard");

window.addEventListener("scroll", () => {
    imgScrollAnimationHeroSection.style.transform = "rotate(" + window.scrollY + "deg)";
    imgScrollAnimationAboutSection.style.transform = "rotate(" + window.scrollY + "deg)";
});

//SETINTERVALL FOR STATS

let missionsCompleted = document.querySelector(".missionsCompleted");
let activeVolunteer = document.querySelector(".activeVolunteer");
let municipality = document.querySelector(".municipality");

async function dataStats() {

    try {

        const response = await fetch("getStatsHomePage", {
            method: 'GET',
        })

        const jsonResult = await response.json();

        if (!response.ok) {
            console.log("test")
            if (jsonResult.messageErrorIsTrue) {
                alertFrontOfficeError.textContent = jsonResult.messageError;
            }
        }

        updateStats(jsonResult);

    } catch (error) {

        console.log(error);
        alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant.";
    }
}
dataStats()

async function updateStats(result) {
    try {

        const stats = {
            mc: result?.dataMissions || 250,
            av: result?.dataUsers || 125,
            m: result?.dataCitys || 90,
        }

        missionsCompleted.textContent = 0;
        activeVolunteer.textContent = 0;
        municipality.textContent = 0;

        let counterMc = 0;
        let counterAv = 0;
        let counterM = 0;

        const timerMc = setInterval(() => {

            counterMc++;
            missionsCompleted.textContent = counterMc;

            if (counterMc == stats.mc) {
                clearInterval(timerMc);
            }

        }, 25);

        const timerAv = setInterval(() => {

            counterAv++;
            activeVolunteer.textContent = counterAv;

            if (counterAv == stats.av) {
                clearInterval(timerAv);
            }

        }, 25);

        const timerM = setInterval(() => {

            counterM++;
            municipality.textContent = counterM;

            if (counterM == stats.m) {
                clearInterval(timerM);
            }

        }, 25);

    } catch (error) {

        console.log(error);
        alertFrontOfficeError.textContent = "Une erreur est survenue. Merci de réessayer dans un instant.";

    }
}

/* 
----------------------------------
----------------------------- IA ----
----------------------------------

async function updateStats(result) {
    // Valeurs par défaut si le fetch échoue ou est vide
    const stats = {
        mc: result?.dataMissions || 250,
        av: result?.dataUsers || 125,
        m: result?.dataCitys || 90
    };

    const duration = 2000; // Animation de 2 secondes pour tout le monde

    const animate = (element, target) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Calcul de la valeur actuelle
            element.textContent = Math.floor(progress * target);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Lancement des animations
    animate(missionsCompleted, stats.mc);
    animate(activeVolunteer, stats.av);
    animate(municipality, stats.m);
}
*/