import React, { Component } from 'react'; // import from react
import { render, Window, App } from 'proton-native'; // import the proton-native components

export default class MainWindow extends Component {
  render() { // all Components must have a render method
    return (
      <App> // you must always include App around everything
        <Window title="Color Schemer" size={{w: 500, h: 300}} menuBar={false}>
            {/* all your other components go here*/}
        </Window>
      </App>
    );
  }
}

