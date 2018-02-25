import React from "react";
import { createPortal } from "react-dom";

const logElement = document.getElementById("log");

const LogMessage = ({ children }) =>
  createPortal(<div className="logMessage">{children}</div>, logElement);

export default LogMessage;
