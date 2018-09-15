import React, {Component} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  VirtualizedList
} from 'react-native';
import KanjiListDetail from './KanjiListDetail'
import LiteralMeaning from './LiteralMeaning'

class ListItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {literal: "", meaning: "Fetching..."};
    this._onPress = this._onPress.bind(this);
  }

  componentDidMount() {
    this.props.db.index(this.props.item, this.props.filter, (item) => {
      let state = {literal, meaning} = item
      this.setState(state)
    })
  }

  _onPress = () => {
    this.props.onPressItem(this.props.item);
  }

  render() {
    return (
      <TouchableHighlight onPress={this._onPress} underlayColor='#dddddd'>
        <LiteralMeaning literal={this.state.literal} meaning={this.state.meaning}/>
      </TouchableHighlight>
    )
  }
}

export default class KanjiList extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {count: 0, filter: 'left'};
    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    this.loadCount()
  }

  filter(text) {
    this.setState({filter: text})
    this.loadCount()
  }

  loadCount() {
    this.props.db.transaction((tx) => {
        tx.executeSql(this.state.filter ?
          `select count(*) as count
                       from Search
                       where Search match '${this.state.filter}'` :
            `select count(*) as count
                       from Search`, [], (tx, results) => {
          this.setState({count: results.rows.item(0).count})
        })
      }
    )
  }

  _onPressItem = (index) => {
    this.props.db.index(index, this.state.filter, (item) => {
      let literal = item.literal
      this.props.navigator.push({
        component: KanjiListDetail,
        title: literal,
        passProps: {
          index: index,
          literal: literal,
          db: this.props.db
        }
      });
    })
  }

  renderHeader = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1}}>
          <TextInput style={{height: 40}}
            placeholder="Type here to translate!" onChangeText={this.filter}
            value={this.state.filter}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <VirtualizedList
        data={this.props.db}
        renderItem={({item}) => <ListItem db={this.props.db} item={item} filter={this.state.filter}
          onPressItem={this._onPressItem}/>}
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
