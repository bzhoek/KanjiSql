import React, {Component} from 'react';
import {Text, SafeAreaView, WebView, StyleSheet} from 'react-native';
import html from './Kanji.html'

export default class KanjiDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {drawing: "", literal: "", meaning: ""}
  }

  componentDidMount() {
    this.props.db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji limit 1 offset ${this.props.index}`, [], (tx, results) => {
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
