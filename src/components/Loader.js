import React from "react";

import LogMessage from "./LogMessage";

const Loader = ({ error, pastDelay, timedOut }) => {
  const message =
    error || timedOut
      ? "Component download failed. Please refresh!"
      : "Downloading components…";

  return pastDelay ? <LogMessage>{message}</LogMessage> : null;
};

export default Loader;
