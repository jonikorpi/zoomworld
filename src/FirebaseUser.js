import React from "react";
import firebase from "firebase/app";
import "firebase/auth";

const isDevelopment = process.env.NODE_ENV === "development";

firebase.initializeApp({
  apiKey: "AIzaSyCLaSIY4KA5C8ywOaVQ5aRNCwWTm50YXF8",
  authDomain: "valtameri-dev.firebaseapp.com",
  databaseURL: "https://valtameri-dev.firebaseio.com",
  projectId: "valtameri-dev",
});

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
      .catch(error => isDevelopment && console.log(error));
  }

  render() {
    return this.props.children(this.state);
  }
}

export default FirebaseUser;
