import React, {Component} from 'react';
import {AppState, NavigatorIOS, TabBarIOS, Text} from 'react-native';
import Database from './Database'
import KanjiForDate from './components/KanjiForDate'
import KanjiList from './components/KanjiList'

import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Remote debugger']);

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
          <KanjiForDate db={this.database} forDate={new Date()}/>
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