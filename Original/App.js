const App = () => {
  // open the airports sheet
  const mySheet = new MySheet({...Settings.sheets.airports})
 
  // convert sheet to object
  const shob = new Shob({mySheet})
 
  // get a handle to another sheet (and create it if it doesnt exist)
  const metreShob = new Shob({mySheet: new MySheet({...Settings.sheets.metres})})
  
  // replace current values (if any) with amended data from the other sheet
  // write out new values with metres and only airports > 2000 metres
  metreShob.writeData({data: shob.data.map(row=>({
    ...row,
    elevation_metres:  row.elevation_ft * 0.3048
  })).filter(f=>f.elevation_metres>2000)})
  
  // lets add the sunset/sunrise for today
  metreShob.data.forEach(f=>{
    const result = Sunset.fetcher({lat: f.latitude_deg, lon: f.longitude_deg})
    // add some things from the weather
    f.date = new Date()
    f.sunrise = result.results.sunrise
    f.sunset = result.results.sunset
    f.dayLength = result.results.day_length
  })
  // and write it back
  metreShob.writeData()
}