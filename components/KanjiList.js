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
    this.props.item.then((state) => this.setState(state))
  }

  _onPress = () => {
    this.props.onPressItem(this.state);
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
    this.database = props.db;
    this.state = {count: 0, filter: this.database.filter};
    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    this.loadCount()
  }

  filter(text) {
    this.database.filter = text
    this.setState({filter: text})
    this.loadCount()
  }

  loadCount() {
    this.props.db.count().then((count) => this.setState({count: count}))
  }

  onPressItem = (item) => {
    this.props.navigator.push({
      component: KanjiListDetail,
      title: item.literal,
      passProps: {
        item: item
      }
    });
  }

  renderHeader = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.filter}>
          <TextInput style={styles.filterInput}
            placeholder="Meaning, literal" onChangeText={this.filter}
            value={this.state.filter}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    let database = this.database
    return (
      <VirtualizedList
        data={database}
        renderItem={({index}) => <ListItem item={database.index(index)} onPressItem={this.onPressItem}/>}
        getItem={(db, index) => index}
        getItemCount={() => this.state.count}
        keyExtractor={(index) => `key${index}`}
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
