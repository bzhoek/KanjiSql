import React, {Component} from 'react';
import {NavigatorIOS} from 'react-native';
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
      <NavigatorIOS initialRoute={{component: KanjiList, passProps: {db: db}, title: 'All Kanji'}} style={{flex: 1}}/>
    );
  }
}