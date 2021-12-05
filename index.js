// capture references to important DOM elements
const weatherContainer = document.getElementById('weather');
const formEl = document.querySelector('form');
const inputEl = document.querySelector('input');


formEl.onsubmit = (e) => {
  // prevent the page from refreshing
  e.preventDefault();

  // capture user's input from form field
  const userInput = inputEl.value.trim()
  // abort API call if user entered no value
  if (!userInput) return
  // call the API and then update the page
  getWeather(userInput)
    .then(displayWeatherInfo)
    .catch(displayLocNotFound)

  // reset form field to a blank state
  inputEl.value = ``
}



// calls the OpenWeather API and returns an object of weather info
async function getWeather(query) {
  // default search to USA
  if (!query.includes(",")) query += ',us'
  // return the fetch call which returns a promise
  // allows us to call .then on this function
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=6efff70fe1477748e31c17d1c504635f`
  )
    // .then((res) => res.json())
    const data = await res.json()
    // .then((data) => {
      // location not found, throw error/reject promise
      if (data.cod === "404") throw new Error('location not found')
      // create weather icon URL
      // const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      // const description = data.weather[0].description
      // const actualTemp = data.main.temp
      // const feelsLikeTemp = data.main.feels_like
      // const place = `${data.name}, ${data.sys.country}`
      // // create JS date object from Unix timestamp
      // const updatedAt = new Date(data.dt * 1000)
      // this object is used by displayWeatherInfo to update the HTML
      // return {
      //   coords: data.coord.lat + ',' + data.coord.lon,
      //   description: description,
      //   iconUrl: iconUrl,
      //   actualTemp: actualTemp,
      //   feelsLikeTemp: feelsLikeTemp,
      //   place: place,
      //   updatedAt: updatedAt
      // }
      const {coord: {lat}, coord: {lon}, weather: [ {description} ], weather: [ {icon} ], main: {temp}, main: {feels_like}, name, sys: {country}, dt } = data
      
      return {
        coords: `${lat},${lon}`,
        description: description,
        iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        actualTemp: temp,
        feelsLikeTemp: feels_like,
        place: `${name}, ${country}`,
        updatedAt: new Date(dt * 1000)
      }
    
}

// show error message when location isn't found
const displayLocNotFound = () => {
  // clears any previous weather info
  weatherContainer.innerHTML = ``;
  // create h2, add error msg, and add to page
  const errMsg = document.createElement('h2')
  errMsg.textContent = `Location not found`
  weatherContainer.appendChild(errMsg)
}

// updates HTML to display weather info
const displayWeatherInfo = (weatherObj) => {
  // clears any previous weather info
  weatherContainer.innerHTML = ``;
  
  const {coords: coords1, description: description1, iconUrl: iconUrl1, actualTemp: actualTemp1, feelsLikeTemp: feelsLikeTemp1, place: place1, updatedAt: updatedAt1} = weatherObj
  
  // inserts a linebreak <br> to weather section tag
  addBreak = () => {
    weatherContainer.appendChild(
      document.createElement('br')
    )
  }

  // weather location element
  const placeName = document.createElement('h2')
  placeName.textContent = place1
  weatherContainer.appendChild(placeName)

  // map link element based on lat/long
  const whereLink = document.createElement('a')
  whereLink.textContent = `Click to view map`
  whereLink.href = `https://www.google.com/maps/search/?api=1&query=${coords1}`
  whereLink.target = `__BLANK`
  weatherContainer.appendChild(whereLink)

  // weather icon img
  const icon = document.createElement('img')
  icon.src = iconUrl1
  weatherContainer.appendChild(icon)

  // weather description
  const description = document.createElement('p')
  description.textContent = description1
  description.style.textTransform = 'capitalize'
  weatherContainer.appendChild(description)

  addBreak()

  // current temperature
  const temp = document.createElement('p')
  temp.textContent = `Current: ${actualTemp1}° F`
  weatherContainer.appendChild(temp)

  // "feels like" temperature
  const feelsLikeTemp = document.createElement('p')
  feelsLikeTemp.textContent = `Feels like: ${feelsLikeTemp1}° F`
  weatherContainer.appendChild(feelsLikeTemp)

  addBreak()

  // time weather was last updated
  const updatedAt = document.createElement('p')
  updatedAt.textContent = `Last updated: ${updatedAt1.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    )}`
  weatherContainer.appendChild(updatedAt)
}