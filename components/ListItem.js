import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import LiteralMeaning from './LiteralMeaning'

export default class ListItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {literal: "", meaning: "Fetching..."};
    this._onPress = this._onPress.bind(this);
  }

  componentDidMount() {
    this._mounted = true
    this.props.item.then((state) => {
      if (this._mounted) this.setState(state)
    })
  }

  componentWillUnmount() {
    this._mounted = false
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