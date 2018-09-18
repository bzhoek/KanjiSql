import React, {Component} from 'react';
import {
  DatePickerIOS,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  WebView
} from 'react-native';
import html from './Kanji.html'
import LiteralMeaning from './LiteralMeaning'

import Randomizer from './Randomizer'

export default class KanjiForDate extends Component {
  constructor(props) {
    super(props);
    this.state = {drawing: "", literal: "", meaning: "", frequency: 0, forDate: this.props.forDate, refreshed: null}
    this.lookup = new Randomizer()

    this.handleSwipe = this.handleSwipe.bind(this);
    this.pickDate = this.pickDate.bind(this);
    this.onPressDate = this.onPressDate.bind(this);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > 64) {
          this.handleSwipe(gestureState.dx > 0 ? -1 : +1)
        } else if (Math.abs(gestureState.dy) > 64) {
          this.handleSwipe(0) // reload
        }
      }
    });
  }

  handleSwipe(delta) {
    let newDate = this.state.forDate
    newDate.setDate(newDate.getDate() + delta)
    this.pickDate(newDate)
  }

  onPressDate() {
    this.setState({picking: !this.state.picking})
    this.loadForState()
  }

  pickDate(newDate) {
    this.setState({forDate: newDate})
    this.loadForState()
  }

  componentDidMount() {
    this.loadForState()
  }

  loadForState() {
    let index = this.lookup.forDate(this.state.forDate)
    this.props.db.frequent(index).then((item) => {
      let state = {drawing, literal, meaning, frequency} = item
      this.setState(state)
      this.setState({refreshed: new Date()})
    })
  }

  render() {
    let drawing = this.state.drawing.replace(/(\r\n|\n|\r)/gm, "")
    let {literal, meaning, frequency, forDate} = this.state
    return (
      <SafeAreaView style={styles.view}>
        <TouchableHighlight onPress={this.onPressDate} underlayColor='#dddddd'>
          <Text style={styles.text}>{this.state.forDate.toDateString()}</Text>
        </TouchableHighlight>
        {this.state.picking &&
        <DatePickerIOS style={styles.pick}
          mode='date'
          date={this.state.forDate}
          onDateChange={this.pickDate}
        />
        }
        <View style={{flex: 1}}{...this._panResponder.panHandlers}>
          <WebView source={html} originWhitelist={['*']} bounces={false}
            style={styles.drawing} key={this.state.refreshed}
            injectedJavaScript={`document.getElementById('kanji-strokes').innerHTML = '${drawing}'; animate_paths()`}/>
        </View>
        <View style={styles.detail}>
          <LiteralMeaning literal={literal} meaning={`${meaning} #${frequency}`}/>
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
    lineHeight: 44,
    textAlign: 'center',
    textAlignVertical: 'center',
  }
});
