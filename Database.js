import SQLite from 'react-native-sqlite-storage';

export default class Database {
  constructor() {
    this.db = null
    this.open()
  }

  logError = (err) => {
    console.log("SQL Error: " + err)
  };

  close() {
    if (this.db) {
      this.db.close(() => console.log("Database CLOSED"), this.logError)
    }
    this.db = null
  }

  open() {
    if (!this.db) {
      this.db = SQLite.openDatabase({
        name: "kanji.sqlite",
        readOnly: true,
        createFromLocation: 1
      }, () => console.log("Database OPENED"), this.logError);
    }
  }

  transaction(callback) {
    this.db.transaction(callback)
  }

}