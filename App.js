import React, {Component} from 'react';
import {NavigatorIOS, TabBarIOS, Text} from 'react-native';
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

class Navigator extends Component<Props> {
  render() {
    return (
      <NavigatorIOS initialRoute={{component: KanjiList, passProps: {db: db}, title: 'All Kanji'}} style={{flex: 1}}/>
    );
  }
}

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {selectedTab: 'tabDaily'};
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
          <Text style={{flex: 1}}>Helleu</Text>
        </TabBarIOS.Item>
        <TabBarIOS.Item systemIcon="more"
          selected={this.state.selectedTab === 'tabList'}
          onPress={() => this.setTab('tabList')}>
          <Navigator/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}