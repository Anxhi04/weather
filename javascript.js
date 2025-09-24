const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityinput");
const card = document.querySelector(".card");
const apikey = "c28dca8790c3a91e7fb0541d993287bb";

let nextHours = [];
let nextTemp =[];
let mychartinstance =null;

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            fetchtemperature(weatherData.nexthours);
            mygraph(nextHours, nextTemp);
            nextdaysinfo(weatherData.nextdays);

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
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;
    const[currentres, forecastres ]  = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
    ])
    if (!currentres.ok ||  !forecastres.ok){
        throw new Error("this is city is not found");
    }
   
    const currentdata = await currentres.json();
    const forecastdata = await forecastres.json();
    const next24Hours = forecastdata.list.slice(0,8)
    const nextdays5 =[];
    const seenDates = new Set();

    forecastdata.list.forEach(item=>{
        const date = item.dt_txt.slice(0,10);
        if(!seenDates.has(date)){
            nextdays5.push(item);
            seenDates.add(date);
        }
    });
   const nextdays = nextdays5.slice(0,5);
    
    return{
        current:currentdata,
        nexthours: next24Hours,
        nextdays:nextdays       
    };

}

function displayWeatherInfo(data){
    const{name:city, 
          main:{temp, humidity},
          weather:[{description, id}]} = data.current;
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
    card.textContent = ""; 
    card.style.display="flex";
    card.appendChild(errorDisplay);
}

async function fetchtemperature(nexthours){
    nextTemp = nexthours.map(item=>item.main.temp);
    nextHours = nexthours.map(item=>item.dt_txt.slice(11,16));
    return{nextHours , nextTemp }
}

//Grafiku i oreve 
function mygraph(nextHours, nextTemp){
  const data = {
    labels: nextHours,
    datasets: [{
      label: 'Weather next 24 hours',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: nextTemp,
    }]
  };

  const config = {
    type: 'line',
    data,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.parsed.y + '°C';
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return value + '°C';
            }
          }
        }
      }
    }
  };
  if(mychartinstance){
    mychartinstance.destroy();
  }
  mychartinstance =  new Chart(
    document.getElementById('myChart'),
    config
  );
}

function nextdaysinfo(forecastDays, containerId){
    const container =document.getElementById("forecastContainer");
    container.textContent="";
    forecastDays.forEach(day=>
       { const daydiv = document.createElement("div");
        daydiv.classList.add("daysbox");

        const dateel = document.createElement("p");
        dateel.textContent=day.dt_txt.slice(0,10);

        const tempel = document.createElement("p");
        tempel.textContent= `${day.main.temp}°C`;

        const emojiel = document.createElement("p");
        emojiel.textContent= getWeatherEmoji(day.weather[0].id);

        
    daydiv.appendChild(dateel);
    daydiv.appendChild(tempel);
    daydiv.appendChild(emojiel);

    container.appendChild(daydiv);
});

}




