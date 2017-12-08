import React from "react";
import Loadable from "react-loadable";

import ComponentSpinner from "./ComponentSpinner";

class ComponentLoader extends React.Component {
  state = {
    component: this.props.component
      ? Loadable({
          loader: () => import(this.props.component),
          loading: ComponentSpinner,
        })
      : null,
  };

  render() {
    const Component = this.state.component;

    if (Component) {
    }

    return Component;
  }
}

export default ComponentLoader;
