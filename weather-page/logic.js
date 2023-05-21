const cityInput = document.getElementById("cityInput");
const time = document.getElementById("time");
const date = document.getElementById("date");
const weatherImg = document.getElementById("weatherImg");
const temp = document.getElementById("temp");
const status = document.getElementById("status");
const feelsLike = document.getElementById("feelsLike");
const direction = document.getElementById("direction");
const speed = document.getElementById("speed");
const name = document.getElementById("name");

function getWeather(){
    fetch('https://api.weatherapi.com/v1/current.json?key=2c11aa3b64454533a60110725232105&q='+cityInput.value+'&aqi=no')
        .then(response => {
            if(response.ok)
            response.json().then(data => {
                weatherImg.src = weatherIcon = data.current.condition.icon.replaceAll("64", "128");
                name.innerHTML = data.location.name
                temp.innerHTML = data.current.temp_c+"°C";
                status.innerHTML = data.current.condition.text;
                feelsLike.innerHTML = "feels like: "+data.current.feelslike_c+"°C";
                direction.innerHTML = "wind direction: "+data.current.wind_dir;
                speed.innerHTML = "wind speed: "+data.current.wind_kph+" kph";
                let myArray = data.location.localtime.split(" ");
                time.innerHTML = myArray[1];
                date.innerHTML = myArray[0];
            });
            else{
                console.log("error");
            }
        })
        .catch(function (error) {
           
        });
}