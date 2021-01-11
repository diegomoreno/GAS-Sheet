const Settings = (()=>{
  return {
    apis: {
      sunset: {
        getUrl: function (lat, lon) {
          return 'https://api.sunrise-sunset.org/json?lat=99&lng=99'
            .replace(/lat=\d+/,`lat=${lat}`).replace(/lng=\d+/,`lng=${lon}`)
        }
      },
      weather: {
        getUrl: function (lat, lon) {
          return 'https://fcc-weather-api.glitch.me/api/current?lat=99&lon=99'
            .replace(/lat=\d+/,`lat=${lat}`).replace(/lon=\d+/,`lon=${lon}`)
        }
      }
    },
    sheets: {
      airports: {
        sheetId: '1GssKM9VYpLGYz9EEwJHyFYF4zDHu_8dm5kbwzNqICM0',
        sheetName: 'Airports'
      },
      metres: {
        sheetId: '1GssKM9VYpLGYz9EEwJHyFYF4zDHu_8dm5kbwzNqICM0',
        sheetName: 'High Airports',
        create: true
      }
    }
  }
})();