import React, {Component} from 'react';
import {Text, TouchableHighlight, VirtualizedList, StyleSheet} from 'react-native';
import KanjiDetail from './KanjiDetail'

class ListItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {text: "Fetching..."};
    this._onPress = this._onPress.bind(this);
  }

  componentDidMount() {
    this.props.db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji limit 1 offset ${this.props.item}`, [], (tx, results) => {
        this.setState({text: results.rows.item(0).meaning})
      })
    })
  }

  _onPress = () => {
    this.props.onPressItem(this.props.item);
  }

  render() {
    return (
      <TouchableHighlight onPress={this._onPress} underlayColor='#dddddd'>
        <Text style={styles.item}>{this.state.text}</Text>
      </TouchableHighlight>
    )
  }
}

export default class KanjiList extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  componentDidMount() {
    this.props.db.transaction((tx) => {
        tx.executeSql(`select count(*) as count
                       from Kanji`, [], (tx, results) => {
          this.setState({count: results.rows.item(0).count})
        })
      }
    )
  }

  _onPressItem = (index) => {
    this.props.navigator.push({
      component: KanjiDetail,
      title: "item.literal",
      passProps: {
        index: index,
        db: this.props.db
      }
    });
  }

  render() {
    return (
      <VirtualizedList
        data={this.props.db}
        renderItem={({item}) => <ListItem db={this.props.db} item={item} onPressItem={this._onPressItem}
          style={styles.item}/>}
        getItem={(db, index) => index}
        getItemCount={() => this.state.count}
        keyExtractor={(item) => `key${item}`}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 88,
  },
});
