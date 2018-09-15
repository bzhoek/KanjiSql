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

  index(index, filter, callback) {
    this.db.transaction((tx) => {
        tx.executeSql(filter ?
          `select *
                       from Search
                       where Search match '${filter}' limit 1 offset ${index}` :
            `select *
                       from Kanji limit 1 offset ${index}`, [], (tx, results) => {
          callback(results.rows.item(0))
        })
      }
    )
  }

}