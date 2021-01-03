let apiKey = "21ab4db3770c2ed2c6f7a6c5ab95932b";
let searchBtn = $(".searchBtn");
let searchIn = $(".searchIn");
let cityEl = $(".city");

let presentDateEl = $(".presentDate");
let weatherIconEl = $(".weatherImg");
let searchHistoryEl = $(".historyItems");
let tempEl = $(".temp");
let humidEl = $(".humid");
let windSpdEl = $(".windSpd");
let uvIndexEl = $(".uvIndex");
let cardRow = $(".card-row");

var today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();
var today = mm + "/" + dd + "/" + yyyy;

if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
  console.log("searchHistory was not found");
} else {
  console.log("searchHistory loaded in to searchHistoryArr");
  renderSearchHistory();
}

searchBtn.on("click", function (e) {
  e.preventDefault();
  if (searchIn.val() === "") {
    alert("Please enter a city");
    return;
  }
  console.log("button was clicked");
  getWeather(searchIn.val());
});

$(document).on("click", ".historyItems", function () {
  console.log("clicked history item");
  let thisElement = $(this);
  getWeather(thisElement.text());
});

function renderSearchHistory(_city) {
  searchHistoryEl.empty();
  let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
  for (let i = 0; i < searchHistoryArr.length; i++) {
    let newListItem = $("<li>").attr("class", "historyItems");
    newListItem.text(searchHistoryArr[i]);
    searchHistoryEl.prepend(newListItem);
  }
}

function renderWeatherData(
  city,
  cityTemp,
  cityHumid,
  cityWindSpd,
  cityWeatherIcon,
  uvVal,
) {
  cityEl.text(city);
  presentDateEl.text(`(${today})`);
  tempEl.text(`Temperature: ${cityTemp} °F`);
  humidEl.text(`Humidity: ${cityHumid}%`);
  windSpdEl.text(`Wind Speed: ${cityWindSpd} MPH`);
  uvIndexEl.text(`UV Index: ${uvVal}`);
  weatherIconEl.attr("src", cityWeatherIcon);
}

function getWeather(desiredCity) {
  let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (weatherData) {
    let cityObj = {
      city: weatherData.name,
      cityTemp: weatherData.main.temp,
      cityHumid: weatherData.main.humidity,
      cityWindSpd: weatherData.wind.speed,
      cityUVIndex: weatherData.coord,
      cityWeatherIconName: weatherData.weather[0].icon,
    };
    let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apiKey}&units=imperial`;
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (uvData) {
      if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
        let searchHistoryArr = [];
        if (searchHistoryArr.indexOf(cityObj.city) === -1) {
          searchHistoryArr.push(cityObj.city);
          localStorage.setItem(
            "searchHistory",
            JSON.stringify(searchHistoryArr)
          );
          let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
          renderWeatherData(
            cityObj.city,
            cityObj.cityTemp,
            cityObj.cityHumid,
            cityObj.cityWindSpd,
            renderedWeatherIcon,
            uvData.value
          );
          renderSearchHistory(cityObj.city);
        } else {
          console.log(
            "Entry exists in searchHistory."
          );
          let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
          renderWeatherData(
            cityObj.city,
            cityObj.cityTemp,
            cityObj.cityHumid,
            cityObj.cityWindSpd,
            renderedWeatherIcon,
            uvData.value
          );
        }
      } else {
        let searchHistoryArr = JSON.parse(
          localStorage.getItem("searchHistory")
        );
        if (searchHistoryArr.indexOf(cityObj.city) === -1) {
          searchHistoryArr.push(cityObj.city);
          localStorage.setItem(
            "searchHistory",
            JSON.stringify(searchHistoryArr)
          );
          let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
          renderWeatherData(
            cityObj.city,
            cityObj.cityTemp,
            cityObj.cityHumid,
            cityObj.cityWindSpd,
            renderedWeatherIcon,
            uvData.value
          );
          renderSearchHistory(cityObj.city);
        } else {
          console.log(
            "Entry exists in searchHistory."
          );
          let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
          renderWeatherData(
            cityObj.city,
            cityObj.cityTemp,
            cityObj.cityHumid,
            cityObj.cityWindSpd,
            renderedWeatherIcon,
            uvData.value
          );
        }
      }
    });
  });
  getFiveDayForecast();

  function getFiveDayForecast() {
    cardRow.empty();
    let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (fiveDayReponse) {
      for (let i = 0; i != fiveDayReponse.list.length; i += 8) {
        let cityObj = {
          date: fiveDayReponse.list[i].dt_txt,
          icon: fiveDayReponse.list[i].weather[0].icon,
          temp: fiveDayReponse.list[i].main.temp,
          humid: fiveDayReponse.list[i].main.humidity,
        };
        let dateStr = cityObj.date;
        let trimmedDate = dateStr.substring(0, 10);
        let weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
        createForecastCard(
          trimmedDate,
          weatherIco,
          cityObj.temp,
          cityObj.humid
        );
      }
    });
  }
}

function createForecastCard(date, icon, temp, humid) {
  let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
  let cardDate = $("<h3>").attr("class", "card-text");
  let cardIcon = $("<img>").attr("class", "weatherIco");
  let cardTemp = $("<p>").attr("class", "card-text");
  let cardHumidity = $("<p>").attr("class", "card-text");

  cardRow.append(fiveDayCardEl);
  cardDate.text(date);
  cardIcon.attr("src", icon);
  cardTemp.text(`Temperature: ${temp} °F`);
  cardHumidity.text(`Humidity: ${humid}%`);
  fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}
