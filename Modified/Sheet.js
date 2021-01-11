class Sheet {
  constructor({ spreadsheetId, sheetName, create }) {
    const ss = SpreadsheetApp.openById(spreadsheetId);
    this._sheet = ss.getSheetByName(sheetName) || (create && ss.insertSheet(sheetName));

    // Copy sheet methods into this.
    // If sheet methods need to be overriden, do so using Object.defineProperties()
    // https://developers.google.com/apps-script/reference/spreadsheet/sheet
    Object.getOwnPropertyNames(this._sheet).forEach(property => {
      this[property] = this._sheet[property];
    });
  }

  /**
   * Get the sheet values from memory, else from the sheet.
   * @returns {object[][]}
   */
  get values() {
    return this._values || this.refreshValues();
  }

  /**
   * Get sheet values, using the range corresponding to the dimensions in which data is present.
   * https://developers.google.com/apps-script/reference/spreadsheet/sheet#getDataRange()
   * https://developers.google.com/apps-script/reference/spreadsheet/range#getvalues
   * @returns {object[][]}
   */
  refreshValues() {
    this.values = this.getDataRange().getValues();
    return this.values;
  }

  /**
   * Save values to memory. Does not write to the sheet.
   * @param {object[][]} values
   */
  set values(values) {
    this._values = values;
  }

  /**
   * Clear the sheet data and write the values provided.
   * @param {object[][]} values
   * @returns {Range}
   */
  writeValues(values) {
    if (values) {
      this.values = values;
    }
    this.clear();
    if (this.values.length && this.values[0] && this.values[0].length) {
      const range = this.getRange(1, 1, this.values.length, this.values[0].length);
      return range.setValues(this.values);
    }
  }

  /**
   * Get records from memory, else from the sheet.
   * @returns {object[]}
   */
  get records() {
    return this._records || this.getRecords();
  }

  /**
   * Save records to memory. Does not write to the sheet.
   */
  set records(records) {
    this._records = records;
  }

  /**
   * Assuming that the sheet represents an object type and each row is a respective record (instance)
   * of that object, this will return each row as a javascript object for easier manipulation.
   * Requires that the first row in the sheet be a header row, which will serve as object keys.
   * @returns {object[]}
   */
  getRecords() {
    const { headers, records } = createRecordsFromValues(this.values);
    this._headers = headers;
    this._records = records;
    return this._records;

    /**
     * Converts an array of values into object records. All objects must have the same structure.
     * First row must be a header row. Values should be similar to that returned by
     * https://developers.google.com/apps-script/reference/spreadsheet/range#getvalues
     * @param {object[][]} values - First row must be a header row.
     * @returns {object} - { "records": object[], "headers": string[] }
     */
    function createRecordsFromValues(values) {
      const [headers, ...records] = values;
      return {
        records: records.map(row => headers.reduce((record, property, i) => {
          record[property] = row[i];
          return record;
        }, {})),
        headers
      };
    }
  }

  /**
   * Write the records to the sheet. Clears any existing data in the sheet.
   * @param {object[]} [records] - If included, will overwrite existing records.
   */
  writeRecords(records) {
    if (records) {
      this._records = records;
    }
    this.values = makeValues(this._records);
    this.writeValues();

    /**
     * Convert the sheet records into an array of values similar to that returned by
     * https://developers.google.com/apps-script/reference/spreadsheet/range#getvalues
     * @param {object[]} records
     * @returns {object[][]}
     */
    function makeValues(records) {
      const headers = Object.keys(records.reduce((accumulator,record) => {
        Object.keys(record).forEach(property => accumulator[property] = property);
        return accumulator;
      }, {}));
  
      return [headers].concat(records.map(record => headers.map(property => record[property])));
    }
  }
}