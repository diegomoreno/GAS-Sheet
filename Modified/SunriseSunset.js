const SunriseSunset = (() => {
  return {
    get: ({ lat, lon }) => {
      const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}`;
      const response = UrlFetchApp.fetch(url);
      return JSON.parse(response.getContentText());
    }
  };
})();