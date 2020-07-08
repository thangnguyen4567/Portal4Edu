import React from 'react';
import {
  Text,
  View,
  ActivityIndicator
} from 'react-native';


export default class VnrLoading extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    if (this.props.isVisible == false) {
      return null;
    }
    return (
      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor:'red'
      }}>
           <ActivityIndicator  size={this.props.size} color={'#33A2F8'} />
      </View>
    );
  }
}
