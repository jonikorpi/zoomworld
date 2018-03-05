import React from "react";

import Renderer from "./Renderer";
import World from "../components/World";

export default ({ userID = null }) => {
  return (
    <Renderer>
      {({ subscribe, unsubscribe, registerCamera, unregisterCamera }) => (
        <World
          {...this.props}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          registerCamera={registerCamera}
          unregisterCamera={unregisterCamera}
        />
      )}
    </Renderer>
  );
};
