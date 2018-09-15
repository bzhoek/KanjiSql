import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View, WebView} from 'react-native';
import html from './Kanji.html'
import LiteralMeaning from './LiteralMeaning'

export default class KanjiListDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {drawing: "", literal: "", meaning: "", frequency: 0}
  }

  componentDidMount() {
    this.props.db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji where literal = '${this.props.literal}'`, [], (tx, results) => {
        let state = {drawing, literal, meaning, frequency} = results.rows.item(0)
        this.setState(state)
      })
    })
  }

  render() {
    let drawing = this.state.drawing.replace(/(\r\n|\n|\r)/gm, "")
    let {literal, meaning, frequency} = this.state
    return (
      <SafeAreaView style={styles.view}>
        <View style={{flex: 1}}>
          <WebView source={html} originWhitelist={['*']} bounces={false}
            style={styles.drawing} key={literal}
            injectedJavaScript={`document.getElementById('kanji-strokes').innerHTML = '${drawing}'; animate_paths()`}/>
        </View>
        <View style={styles.detail}>
          <Text style={styles.text}>{frequency}</Text>
          <LiteralMeaning literal={literal} meaning={meaning}/>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff'
  },
  drawing: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  detail: {
    flex: 1,
    padding: 8,
  },
  text: {
    fontSize: 18,
  }
});
