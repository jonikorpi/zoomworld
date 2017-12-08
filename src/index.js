import React from "react";
import { hydrate, render } from "react-dom";
// import registerServiceWorker from './registerServiceWorker';

import "./reset.css";
import "./globals.css";
import "./components.css";
import Game from "./Game";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<Game />, rootElement);
} else {
  render(<Game />, rootElement);
}

// registerServiceWorker();
