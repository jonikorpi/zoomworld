import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// const isDevelopment = process.env.NODE_ENV === "development";

firebase.initializeApp(
  // isDevelopment ?
  {
    apiKey: "AIzaSyCLaSIY4KA5C8ywOaVQ5aRNCwWTm50YXF8",
    authDomain: "valtameri-dev.firebaseapp.com",
    databaseURL: "https://valtameri-dev.firebaseio.com",
    projectId: "valtameri-dev",
    // storageBucket: "",
    // messagingSenderId: "960172907702"
  }
  // : {
  //     apiKey: "AIzaSyBROe3cnHmQ4K7B8iuuTNqCj_Tdrw76djQ",
  //     authDomain: "scrollworld-30a25.firebaseapp.com",
  //     databaseURL: "https://scrollworld-30a25.firebaseio.com",
  //     projectId: "scrollworld-30a25",
  //     // storageBucket: "",
  //     // messagingSenderId: "324510204761",
  //   }
);

class FirebaseProvider extends React.Component {
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
    return this.props.render(this.state);
  }
}

export default FirebaseProvider;
