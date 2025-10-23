const cityInput = document.querySelector('.city');

const displayListCity = document.querySelector('.displayListCity');

cityInput.addEventListener('input', async (e) => {

    try {

        let inputValue = e.target.value;

        const response = await fetch(`searchCity?q=${inputValue}`);

        if (!response.ok) {
            throw new Error('--->>>', response.status);
        }

        const result = await response.json();

        displayListCity.innerHTML = '';

        if (inputValue.length > 1) {

            for (let i = 0; i < result.length; i++) {

                const li = document.createElement('li');

                displayListCity.classList.add('show');

                li.textContent = result[i].cityName;
                li.dataset.idCity = result[i].idCity;
                displayListCity.appendChild(li);

                li.addEventListener('click', () => {

                    cityInput.value = li.textContent;

                    console.log(cityInput.value)

                    const selectedIdCity = li.dataset.idCity;
                    displayListCity.classList.remove('show');

                    console.log('---selectedIdCity--->', selectedIdCity);

                    document.querySelector('.cityId').value = selectedIdCity;

                    console.log(document.querySelector('.cityId').value)

                });

            }

        } else {

            displayListCity.classList.remove('show')

        }

    } catch (error) {

        console.log('--->>>', error);

    }

})








