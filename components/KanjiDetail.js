import React, {Component} from 'react';
import {Text, SafeAreaView, WebView, StyleSheet} from 'react-native';
import html from './Kanji.html'

import Randomizer from './Randomizer'

export default class KanjiDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {drawing: "", literal: "", meaning: ""}
    this.lookup = new Randomizer()
    this.index = this.lookup.forDate()
    this.index = 0
  }

  componentDidMount() {
    this.props.db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji where frequency not null order by frequency limit 1 offset ${this.index}`, [], (tx, results) => {
        let state = {drawing, literal, meaning} = results.rows.item(0)
        this.setState(state)
      })
    })
  }

  render() {
    let drawing = this.state.drawing.replace(/(\r\n|\n|\r)/gm, "")
    let {literal, meaning} = this.state
    return (
      <SafeAreaView style={styles.view}>
        <WebView source={html} originWhitelist={['*']}
          style={styles.drawing} key={literal}
          injectedJavaScript={`document.getElementById('kanji-strokes').innerHTML = '${drawing}'; animate_paths()`}/>
        <Text style={styles.detail}>{meaning}</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  view: {flex: 1, backgroundColor: '#fff'},
  drawing: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  detail: {flex: 1}
});
