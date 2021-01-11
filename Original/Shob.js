// create and manage an object from sheet values
class Shob {
  
  static makeValues ({data}) {
    // derive the headers from the data 
    const headers = Object.keys(data.reduce((p,row)=> {
      Object.keys(row).forEach(col=>p[col]=col)
      return p
    },{}))
    // combine the headers and the values
    return [headers].concat(data.map(row=>headers.map(col=>row[col])))
  }
 
  static makeData ({values}) {
    const [headers,...data] = values
    return {
      data: data.map(row=>headers.reduce((p,c,i)=>{
        p[c] = row[i]
        return p
      },{})),
      headers 
    }
  }
 
  constructor ({mySheet}) {
    this._mySheet = mySheet
    this.readValues()
  }
 
  // convert data to values and store
  setValues ({data}) {
    this.values =  this.constructor.makeValues({data: data || this.data})
  }
  set values (values) {
    this._values = values
  }
  get values () {
    return this._values
  }
 
  set headers (headers) {
    this._headers = headers
  }
  get headers () {
    return this._headers
  }
 
  // convert values to data and store
  setData ({values}) {
    const {headers, data} = this.constructor.makeData({values: values || this.values })
    this.headers = headers
    this.data = data
    return this.data
  }
 
  set data (data) {
    this._data = data
  }
  get data () {
    return this._data
  }
 
  get mySheet () {
    return this._mySheet 
  }
 
  writeData (options) {
    // convert data to values and write to sheet
    const data = (options && options.data) || this.data
    this.setValues ({data})
    this.writeValues ()
  }
 
  writeValues (options) {
    const values = (options && options.values) || this.values
    this.mySheet.setValues({values})
  }
 
  readValues () {
    this.values = this.mySheet.getValues()
    this.setData ({values: this.values})
    return this.values
  }
 
}