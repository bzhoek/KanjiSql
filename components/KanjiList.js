import React, {Component} from 'react';
import {Text, SafeAreaView, VirtualizedList, StyleSheet} from 'react-native';

class ListItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {text: "Fetching..."};
  }

  componentDidMount() {
    this.props.db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji limit 1 offset ${this.props.item}`, [], (tx, results) => {
        this.setState({text: results.rows.item(0).meaning})
      })
    })
  }

  render() {
    return (
      <Text style={styles.item}>{this.state.text}</Text>
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

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#eee'}}>
        <VirtualizedList
          data={this.props.db}
          renderItem={({item}) => <ListItem db={this.props.db} item={item} style={styles.item}/>}
          getItem={(db, index) => index}
          getItemCount={() => this.state.count}
          keyExtractor={(item) => `key${item}`}
        />
      </SafeAreaView>
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
