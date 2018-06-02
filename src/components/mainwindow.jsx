import React, { Component } from 'react';
import {
  render,
  App,
  Button,
  ColorButton,
  Form,
  Grid,
  Text,
  Window
} from 'proton-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import Reducer from '../reducers';

export class MainWindow extends Component {
  updateColor(color) {
    this.props.setColor(color);
  }
  
  printColor() {
    console.log(this.props.color);
  }

  render() {
    const c = this.props.color;
    return (
      <App>
        <Window title="Color Schemer" size={{w: 500, h: 300}} menuBar={false}>
          <Form row={0} column={0}>
            <ColorButton
              color={`rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`}
              label="Primary Color: "
              onChange={this.updateColor.bind(this)}
            />
            <Button onClick={this.printColor.bind(this)} row={2} column={0}>
              Generate Color Scheme
            </Button>
          </Form>
        </Window>
      </App>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    color: state.color,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainWindow);

