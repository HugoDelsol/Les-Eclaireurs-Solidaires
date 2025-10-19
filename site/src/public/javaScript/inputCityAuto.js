const cityInput = document.querySelector('#city');

const displayListCity = document.querySelector('.displayListCity');


cityInput.addEventListener('input', async (e) => {

    try {

        const inputValue = e.target.value;

        const response = await fetch(`searchCity?q=${inputValue}`);

        if (!response.ok) {
            throw new Error('--->>>', response.status);
        }

        const result = await response.json();

        console.log(result);

        if (inputValue.length > 2){
            displayListCity.textContent = result
        }

        

        return (result);

    } catch (error) {

        console.log('--->>>', error);

    }

})


