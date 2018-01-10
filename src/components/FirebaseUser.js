import React from "react";
import firebase from "firebase/app";
import "firebase/auth";

class FirebaseUser extends React.Component {
  state = { userID: null, isAnonymous: null };

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user =>
      this.setState({
        userID: user && user.uid,
        isAnonymous: user && user.isAnonymous,
      })
    );

    firebase
      .auth()
      .signInAnonymously()
      .catch(error => console.log(error));
  }

  render() {
    return this.props.children(this.state);
  }
}

export default FirebaseUser;
