import React, {Component} from 'react';
import {
  DatePickerIOS,
  PanResponder,
  Text,
  TouchableHighlight,
  SafeAreaView,
  View,
  WebView,
  StyleSheet
} from 'react-native';
import html from './Kanji.html'
import LiteralMeaning from './LiteralMeaning'

import Randomizer from './Randomizer'

export default class KanjiForDate extends Component {
  constructor(props) {
    super(props);
    this.state = {drawing: "", literal: "", meaning: "", frequency: 0, forDate: this.props.forDate}
    this.lookup = new Randomizer()

    this.handleSwipe = this.handleSwipe.bind(this);
    this.pickDate = this.pickDate.bind(this);
    this.onPressDate = this.onPressDate.bind(this);
  }

  componentWillMount() {
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

  onPressDate() {
    this.setState({picking: !this.state.picking})
  }

  pickDate(newDate) {
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
        {this.state.picking &&
        <DatePickerIOS style={styles.pick}
          mode='date'
          date={this.state.forDate}
          onDateChange={this.pickDate}
        />
        }
        <View style={{flex: 1}}{...this._panResponder.panHandlers}>
          <WebView source={html} originWhitelist={['*']} bounces={false}
            style={styles.drawing} key={literal}
            injectedJavaScript={`document.getElementById('kanji-strokes').innerHTML = '${drawing}'; animate_paths()`}/>
        </View>
        <View style={styles.detail}>
          <TouchableHighlight onPress={this.onPressDate} underlayColor='#dddddd'>
            <Text style={styles.text}>{this.state.forDate.toDateString()}</Text>
          </TouchableHighlight>

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
