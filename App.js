import React, {Component} from 'react';
import SQLite from 'react-native-sqlite-storage';
import KanjiList from './components/KanjiList'

let errorCB = (err) => {
  console.log("SQL Error: " + err)
};
let openCB = () => {
  console.log("Database OPENED")
};

let db = SQLite.openDatabase({name: "kanji.sqlite", readOnly: true, createFromLocation: 1}, openCB, errorCB);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <KanjiList db={db} style={{flex: 1, backgroundColor: '#eee'}}/>
    );
  }
}