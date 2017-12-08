import React from "react";
import { createPortal } from "react-dom";

const logElement = document.getElementById("log");

const StatusMessage = ({ children }) =>
  createPortal(<div className="statusMessage">{children}</div>, logElement);

export default StatusMessage;
