const App = () => {
  // open the airports sheet
  const sheet = new Sheet({ ...Settings.sheets.airports });

  // get a handle to another sheet (and create it if it doesnt exist)
  const metresSheet = new Sheet({ ...Settings.sheets.metres });

  // replace current values (if any) with amended data from the other sheet
  // write out new values with metres and only airports > 2000 metres
  metresSheet.writeRecords(sheet.getRecords().map(record => ({
    ...record,
    elevation_metres: record.elevation_ft * 0.3048,
  })).filter(f => f.elevation_metres > 2000));

  // lets add the sunset/sunrise for today
  metresSheet.getRecords().forEach(record => {
    const response = SunriseSunset.get({ lat: record.latitude_deg, lon: record.longitude_deg });
    record.date = new Date();
    record.sunrise = response.results.sunrise;
    record.sunset = response.results.sunset;
    record.dayLength = response.results.day_length;
  });

  // and write it back
  metresSheet.writeRecords();
}