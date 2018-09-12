import React, {Component} from 'react';
import {PanResponder, Text, SafeAreaView, View, WebView, StyleSheet} from 'react-native';
import html from './Kanji.html'

import Randomizer from './Randomizer'

export default class KanjiDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {drawing: "", literal: "", meaning: "", frequency: 0, forDate: new Date()}
    this.lookup = new Randomizer()

    this.handleSwipe = this.handleSwipe.bind(this);

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        console.log(`Granted ${gestureState.x0}`)
      },
      onPanResponderRelease: (e, gestureState) => {
        this.handleSwipe(gestureState.dx > 0 ? -1 : +1)
      }
    });
  }

  handleSwipe(delta) {
    let newDate = this.state.forDate
    newDate.setDate(newDate.getDate() + delta)
    this.setState({forDate: newDate})
  }

  componentDidMount() {
    this.loadForState()
  }

  componentDidUpdate() {
    this.loadForState()
  }

  loadForState() {
    let index = this.lookup.forDate(this.state.forDate)

    this.props.db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji
                     where frequency not null
                     order by frequency limit 1 offset ${index}`, [], (tx, results) => {
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
        <View style={{flex: 1}}{...this._panResponder.panHandlers}>
          <WebView source={html} originWhitelist={['*']} bounces={false}
            style={styles.drawing} key={literal}
            injectedJavaScript={`document.getElementById('kanji-strokes').innerHTML = '${drawing}'; animate_paths()`}/>
          <View style={styles.detail}>
            <Text style={styles.text}>{this.state.forDate.toDateString()}</Text>
            <Text style={styles.text}>{meaning} {frequency}</Text>
          </View>
        </View>
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
  detail: {
    flex: 1,
    padding: 8,
  },
  text: {
    fontSize: 18,
  }
});
