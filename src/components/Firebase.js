import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-firebase";

class Firebase extends React.Component {
  render() {
    return this.props.children(this.props.firebase);
  }
}

export default connect(
  (props, ref) => props.query || {},
  (props, firebase) => {
    return { ...props, firebase: firebase };
  }
)(Firebase);
