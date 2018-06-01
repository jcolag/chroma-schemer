import React, { Component } from 'react';
import { render, App, ColorButton, Grid, Text, Window } from 'proton-native';

export default class MainWindow extends Component {
  updateColor(color) {
    console.log(color);
  }

  render() {
    return (
      <App>
        <Window title="Color Schemer" size={{w: 500, h: 300}} menuBar={false}>
          <Grid padded={true}>
        	<Text row={0} column={0}>Select a primary color:</Text>
        	<ColorButton color="#007700" onChange={this.updateColor.bind(this)} row={1} column={0} />
            {/* all your other components go here*/}
          </Grid>
        </Window>
      </App>
    );
  }
}

