const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityinput");
const card = document.querySelector(".card");
const apikey = "c28dca8790c3a91e7fb0541d993287bb";

weatherForm.addEventListener("submit", async event=>{

    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try{
            const weatherData = await getWeatherData(city);

        }catch(error){{
            console.error(error);
        }

    }else {
        displayError("Please enter a city name.");
        return;
    }


});

async function getWeatherData(city){

}

function displayWeatherInfo(data){

}

function getWeatherEmoji(weatherId){

}
function displayError(message){
    const errorDisplay= document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = ""; // Clear previous content
    card.style.display="flex";
    card.appendChild(errorDisplay);

}











