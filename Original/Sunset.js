const Sunset = (()=>{
  
  const fetcher = ({lat, lon}) => {
    const {getUrl} = Settings.apis.sunset
    const result = UrlFetchApp.fetch(getUrl(lat, lon))
    return JSON.parse(result.getContentText())
  }
  return {
    fetcher
  }
})()