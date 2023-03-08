const key = "564bbcf90c3ed93ff2d936a6999bae23"
let searchHistoryArr = []
let fiveDay = document.getElementById("fiveDayForcast");
let list = document.getElementById("searchHistroy")

if(localStorage.getItem("searchHistroy") !== null){
    searchHistoryArr = JSON.parse(localStorage.searchHistroy)

    for(let i = 0; i < searchHistoryArr.length; i++){ // adds a button for each item on the list
        let btn = document.createElement("button")
        btn.innerText = searchHistoryArr[i]
        btn.addEventListener("click", () => {citySearch(searchHistoryArr[i])})
        btn.classList.add("btn");
        btn.classList.add("btn-primary");
        btn.classList.add("m-1");
        list.append(btn)
    }
}

$("#currentDay").text(dayjs().format("MMM,D,YYYY h:mm:ss")); // set current time on load
setInterval(function () {
  $("#currentDay").text(dayjs().format("MMM,D,YYYY h:mm:ss")); // updates time
}, 10);

function citySearch(cityName){
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=imperial`)
  .then(function(response){
    return response.json()
  })
  .then(function(data){ // updates the main weather display, gathers informaion for other functions
    const {lat, lon} = data.coord
    document.getElementById("city").innerText = cityName
    document.getElementById("iconText").innerText = data.weather[0].description
    document.getElementById("icon").src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
    document.getElementById("temp").innerText = "Temp: "+data.main.temp+"°F"
    document.getElementById("hightemp").innerText = "High Temp: "+data.main.temp_max+"°F"
    document.getElementById("lowtemp").innerText = "Low Temp: "+data.main.temp_min+"°F"
    document.getElementById("wind").innerText = "Wind Speed: "+data.wind.speed+"MPH"
    document.getElementById("humidity").innerText = "Humidity: "+data.main.humidity+"%"
    // console.log(cityName)
    forcast(lat, lon)
    searchHistory(cityName)
  })
}

function searchHistory(cityName){
    if(searchHistoryArr.includes(cityName)){ // Removes already existing citys from the list
        for(let i = 0; i < searchHistoryArr.length; i++){
            if (cityName == searchHistoryArr[i]){
                searchHistoryArr.splice(i, 1)
            }
        }
    }

    while (list.hasChildNodes()) { // clears the existing buttons
        list.removeChild(list.firstChild);
    }
    
    searchHistoryArr.unshift(cityName)
    console.log(searchHistoryArr)

    if(searchHistoryArr.length > 10){ // keeps list no larger than 10
        searchHistoryArr.pop()
    }

    for(let i = 0; i < searchHistoryArr.length; i++){ // adds a button for each item on the list
        let btn = document.createElement("button")
        btn.innerText = searchHistoryArr[i]
        btn.addEventListener("click", () => {citySearch(searchHistoryArr[i])})
        btn.classList.add("btn");
        btn.classList.add("btn-primary");
        btn.classList.add("m-1");
        list.append(btn)
    }
    localStorage.setItem("searchHistroy", JSON.stringify(searchHistoryArr))
}

function forcast(lat, lon){
    fiveDay.innerHTML = ''
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        const forcastData = data.list.filter(item => item.dt_txt.includes("12:00:00")) // Limits forcast to the 12:00 hour
        for(let i = 0; i < forcastData.length; i++){
            let nextDay = document.createElement("div")
            nextDay.classList.add("row")
            let time = forcastData[i].dt_txt // split at : 2023-03-08 12:00:00

            nextDay.innerHTML = `
            <div class="card col-5" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${forcastData[i].dt_txt}</h5>
                    <img src = 'https://openweathermap.org/img/w/${forcastData[i].weather[0].icon}.png' >
                    <p>Temp: ${forcastData[i].main.temp}°F</p>
                    <p>Wind Speed: ${forcastData[i].wind.speed}MPH</p>
                    <p>Humidity: ${forcastData[i].main.humidity}%</p>
                </div>
            </div>
            `
            fiveDay.appendChild(nextDay)
        }
    })
}