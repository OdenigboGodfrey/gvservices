import React, { Component, useState } from "react";
import { setContext } from "./src/utils";

const AppContext = React.createContext({});

const defaultContext = {
  name: "Gv Services",
  balance: 0,
  user_data: undefined,
  token: undefined,
  paystackKey: 'sk_test_f9834df4ac267fdf7ebb3630bb29f4da35b73965',
  isEmptorMode: true,
  prev_source: '',
  _home: false,
  _offers: false,
  _wallet: false,
  _models: false,
  _gigs: false,
  _more: false,
};


class AppProvider extends Component {
  state = defaultContext;
  
  set = (value) => {
    this.setState(value);
    setTimeout(() => {
      setContext({state: this.state});
    }, 1000);
    return true;
  };

  render() {
    const context = this.state;
    return (
      <AppContext.Provider
        value={{
          state: context,
          set: (value) => {
            return this.set(value);
          },
          getState: (key)=> this.state[key],
          reloadState: () => this.state,
          reloadState2: () => "Heloo",
          reset: () => {
            console.log("resetting context", this.state);
            this.state = this.set(defaultContext);
            console.log("resetting context", this.state);
          },
          
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export { AppProvider, AppContext };
export const AppConsumer = AppContext.Consumer;
