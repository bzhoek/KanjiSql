import React, {Component} from 'react';
import {AppState, NavigatorIOS, TabBarIOS, Text} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import KanjiDetail from './components/KanjiDetail'
import KanjiList from './components/KanjiList'

import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Remote debugger']);

class Database {
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

type Props = {};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.database = new Database()
    this.state = {selectedTab: 'tabList'};
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.database.close()
    } else if (nextAppState.match(/active/)) {
      this.database.open()
    }
    console.log(`App state is ${nextAppState}`)
  }

  setTab(tabId) {
    this.setState({selectedTab: tabId});
  }

  render() {
    return (
      <TabBarIOS style={{flex: 1}}>
        <TabBarIOS.Item systemIcon="history"
          selected={this.state.selectedTab === 'tabDaily'}
          onPress={() => this.setTab('tabDaily')}>
          <KanjiDetail db={this.database} index={0}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item systemIcon="more"
          selected={this.state.selectedTab === 'tabList'}
          onPress={() => this.setTab('tabList')}>
          <NavigatorIOS initialRoute={{component: KanjiList, passProps: {db: this.database}, title: 'All Kanji'}}
            style={{flex: 1}}/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}