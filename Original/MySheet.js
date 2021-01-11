class MySheet {
  static open ({sheetId, sheetName, create}) {
    const ss = SpreadsheetApp.openById(sheetId)
    return ss.getSheetByName(sheetName) || (create && ss.insertSheet(sheetName))
  }
  static replaceValues ({sheet, values}) {
    sheet.getDataRange().clear()
    if(values.length && values[0] && values[0].length) {
      const range = sheet.getRange(1,1,values.length,values[0].length)
      return range.setValues(values)
    }
 
  }
  constructor (options) {
    this._sheet = this.constructor.open(options)
  }
  get sheet () {
    return this._sheet
  }
  get dataRange () {
    return this.sheet.getDataRange()
  }
  // get currently cached valued
  get values () {
    // if we dont have any then get some
    return this._values || this.getValues()
  }
  // get values from sheet
  getValues () {
    // caching for later
    this._values = this.dataRange.getValues()
    return this._values
  }
  // set currently cached values
  set values (val) {
    this._values = val
  }
  // write current (or new) values to sheet
  setValues ({values}) {
    if (values) {
      this.values = values
    }
    return this.constructor.replaceValues({sheet: this.sheet, values: this.values})
  }
}