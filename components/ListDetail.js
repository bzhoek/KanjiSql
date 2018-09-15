import React, {Component} from 'react';
import {StyleSheet, View, WebView} from 'react-native';
import html from './Kanji.html'
import LiteralMeaning from './LiteralMeaning'

export default class ListDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {drawing, literal, meaning, frequency} = props.item
  }

  render() {
    let drawing = this.state.drawing.replace(/(\r\n|\n|\r)/gm, "")
    let {literal, meaning, frequency} = this.state
    return (
      <View style={{flex: 1}}>
        <WebView source={html} originWhitelist={['*']} bounces={false}
          style={styles.drawing} key={literal}
          injectedJavaScript={`document.getElementById('kanji-strokes').innerHTML = '${drawing}'; animate_paths()`}/>
        <View style={styles.detail}>
          <LiteralMeaning literal={literal} meaning={frequency ? `${meaning} #${frequency}` : meaning}/>
        </View>
      </View>
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
