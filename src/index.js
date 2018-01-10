import React from "react";
import { hydrate, render } from "react-dom";
// import registerServiceWorker from './registerServiceWorker';
import firebase from "firebase/app";

import "./css/reset.css";
import "./css/globals.css";
import "./css/components.css";
import Game from "./components/Game";

// const isDevelopment = process.env.NODE_ENV === "development";

firebase.initializeApp({
  apiKey: "AIzaSyCLaSIY4KA5C8ywOaVQ5aRNCwWTm50YXF8",
  authDomain: "valtameri-dev.firebaseapp.com",
  databaseURL: "https://valtameri-dev.firebaseio.com",
  projectId: "valtameri-dev",
});

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<Game />, rootElement);
} else {
  render(<Game />, rootElement);
}

// registerServiceWorker();
