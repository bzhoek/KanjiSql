import React, {Component} from 'react';
import {StyleSheet, Text, SafeAreaView, VirtualizedList} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

let errorCB = (err) => {
  console.log("SQL Error: " + err)
};
let openCB = () => {
  console.log("Database OPENED")
};

let db = SQLite.openDatabase({name: "kanji.sqlite", readOnly: true, createFromLocation: 1}, openCB, errorCB);

type Props = {};

class ListItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {text: "Fetching..."};
    db.transaction((tx) => {
      tx.executeSql(`select *
                     from Kanji limit 1 offset ${props.item}`, [], (tx, results) => {
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

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    db.transaction((tx) => {
        tx.executeSql(`select count(*) as count
                       from Kanji`, [], (tx, results) => {
          this.setState({count: results.rows.item(0).count})
        })
      }
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <VirtualizedList
          data={db}
          renderItem={({item}) => <ListItem item={item} style={styles.item}/>}
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
