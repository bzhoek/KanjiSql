import SQLite from 'react-native-sqlite-storage';

export default class Database {
  constructor() {
    this.db = null
    this.filter = ''
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

  execute(sql, cb) {
    this.db.transaction((tx) => {
      tx.executeSql(sql, [], (tx, results) => {
        cb(results)
      })
    })
  }


  count() {
    return new Promise((resolve) => {
      this.execute(this.filter
        ? `select count(*) as count from Search where Search match '${this.filter}'`
        : `select count(*) as count from Search`, (results) => {
        resolve(results.rows.item(0).count)
      })
    })
  }

  index(index) {
    return new Promise((resolve) => {
      this.execute(this.filter
        ? `select * from Search where Search match '${this.filter}' limit 1 offset ${index}`
        : `select * from Kanji limit 1 offset ${index}`, (results) => {
        resolve(results.rows.item(0))
      })
    })
  }

  frequent(index) {
    return new Promise((resolve) => {
      this.execute(`select * from Kanji
                     where frequency not null
                     order by frequency limit 1 offset ${index}`, (results) => {
        resolve(results.rows.item(0))
      })
    })
  }

}