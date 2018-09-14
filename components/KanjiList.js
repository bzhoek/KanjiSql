import React, {Component} from 'react';
import {
  Keyboard,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
  StyleSheet
} from 'react-native';
import KanjiDetail from './KanjiDetail'

class ListItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {literal: "", meaning: "Fetching..."};
    this._onPress = this._onPress.bind(this);
  }

  componentDidMount() {
    this.props.db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji limit 1 offset ${this.props.item}`, [], (tx, results) => {
        let state = {literal, meaning} = results.rows.item(0)
        this.setState(state)
      })
    })
  }

  _onPress = () => {
    this.props.onPressItem(this.props.item);
  }

  render() {
    return (
      <TouchableHighlight onPress={this._onPress} underlayColor='#dddddd'>
        <View style={styles.item}>
          <Text style={styles.literal}>{this.state.literal}</Text>
          <Text style={styles.meaning}>{this.state.meaning}</Text>
        </View>
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

  renderHeader = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1}}>
          <TextInput />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <VirtualizedList
        data={this.props.db}
        renderItem={({item}) => <ListItem db={this.props.db} item={item} onPressItem={this._onPressItem}/>}
        getItem={(db, index) => index}
        getItemCount={() => this.state.count}
        keyExtractor={(item) => `key${item}`}
        ListHeaderComponent={this.renderHeader}
      />
    );
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
