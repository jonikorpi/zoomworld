import React from "react";
import { hydrate, render } from "react-dom";
// import registerServiceWorker from './registerServiceWorker';
import firebase from "firebase/app";

import "./reset.css";
import "./globals.css";
import "./components.css";
import Game from "./Game";

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
