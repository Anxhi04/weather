const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityinput");
const card = document.querySelector(".card");
const apikey = "c28dca8790c3a91e7fb0541d993287bb";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);

        }catch(error){
            console.error(error);
            displayError(error);
        }

    }else {
        displayError("Please enter a city name.");
        return;
    }


});

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(apiUrl);
    if(!response.ok){
        throw new Error("This city is not found");
    }
    return response.json();

}

function displayWeatherInfo(data){
    const{name:city, 
          main:{temp, humidity},
          weather:[{description, id}]} = data;
    card.textContent = ""; // Clear previous content
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");


    cityDisplay.textContent = city;
    tempDisplay.textContent = `Temperature: ${temp}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = `Description: ${description}`;
    weatherEmoji.textContent = getWeatherEmoji(id);


    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");


    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            return "🌩️";
        case(weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case(weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case(weatherId >= 600 && weatherId < 700):
            return "❄️";        
        case(weatherId >= 700 && weatherId < 800):
            return "❄️";
        case(weatherId === 800):
            return "☀️";
        case(weatherId > 800 && weatherId < 900):
            return "☁️";
        default:
            return"❓";
    }


}
function displayError(message){
    const errorDisplay= document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = ""; // Clear previous content
    card.style.display="flex";
    card.appendChild(errorDisplay);



}











