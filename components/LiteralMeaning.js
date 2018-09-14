import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class LiteralMeaning extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.item}>
        <Text style={styles.literal}>{this.props.literal}</Text>
        <Text style={styles.meaning}>{this.props.meaning}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 8,
    height: 64
  },
  literal: {
    fontSize: 48
  },
  meaning: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 18,
  },
});
