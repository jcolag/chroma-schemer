import React, { Component } from 'react';
import {
  render,
  App,
  Button,
  Checkbox,
  ColorButton,
  Dialog,
  Form,
  Grid,
  Picker,
  Slider,
  Text,
  Window
} from 'proton-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import Reducer from '../reducers';
import fs from 'fs';

export class MainWindow extends Component {
  updateColor(color) {
    this.props.setColor(color);
  }
  
  updateScheme(text) {
    this.props.setScheme(text);
  }
  
  updateAccent(checked) {
    this.props.setAccent(checked);
  }
  
  updateAngle(angle) {
    this.props.setAngle(angle);
  }
  
  hsl(name, h, s, l) {
    return `  --${name}: hsl(${h}, ${s}%, ${l}%);\n`;
  }
  
  generateShades(prefix, h, s, l) {
    let result = this.hsl(prefix, h, s, l);
    let step = l > 25 ? 12 : (l / 2 - 1);
    result += this.hsl(`${prefix}-dark`, h, s, l - step);
    result += this.hsl(`${prefix}-darker`, h, s, l - step * 2);
    step = l < 75 ? 12 : ((100 - l) / 2 - 1);
    result += this.hsl(`${prefix}-light`, h, s, l + step);
    result += this.hsl(`${prefix}-lighter`, h, s, l + step * 2);
    return result;
  }
  
  printColor() {
    let filename = '';
    try {
      filename = Dialog('Save');
    } catch(e) {
      // Probably just canceled the dialog
      return;
    }
    let h = this.props.color.h;
    let s = this.props.color.s;
    let l = this.props.color.l;
    let th = this.props.theta;
    switch (this.props.scheme) {
      case 0:
      case 1:
      case 3:
        break;
      case 2:
        th = 120;
        break;
      case 4:
        th = 90;
        break;
    }
    let css = ':main {\n  /* Use with, for example, "var(--base-color)" */\n';
    css += this.generateShades('base-color', h, s, l);
    css += this.generateShades(
      'alt-color',
      (h + (this.props.scheme === 0 ? 0 : th)) % 360,
      s,
      l);
    let angle = 0;
    switch (this.props.scheme) {
      case 0:
        // All colors are the same;
        break;
      case 1:
      case 2:
      case 4:
        angle = -th;
        break;
      case 3:
        angle = th + 180;
        break;
    }
    css += this.generateShades(
      'third-color',
      (h + angle + 360) % 360,
      s,
      l);
    var comp = this.props.accent || this.props.scheme === 4;
    css += this.generateShades(
      'accent-color',
      (h + (comp ? 180 : 0)) % 360,
      s,
      l);
    css += "}";
    try {
      fs.writeFileSync(filename, css);
    } catch (e) {
      Dialog(error, { description: e });
    }
  }

  render() {
    const c = this.props.color;
    let scheme = '';
    switch (this.props.scheme) {
      case 0:
        scheme = 'Colors will all have the same hue.';
        break;
      case 1:
        scheme = 'Colors are in groups that are equidistant from each other on the color wheel.';
        break;
      case 2:
        scheme = 'Three colors equally spaced around the color wheel.';
        break;
      case 3:
        scheme = 'Four colors arranged into two complementary pairs.';
        break;
      case 4:
        scheme = 'Four colors spaced evenly around the color wheel.';
        break;
      default:
        scheme = 'Some unknown color scheme - how did you get here?';
        break;
    }
    return (
      <App>
        <Window title="Color Schemer" size={{w: 750, h: 450}} menuBar={false}>
          <Form row={0} column={0}>
            <ColorButton
              color={`rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`}
              label=" Base Color: "
              onChange={this.updateColor.bind(this)}
            />
            <Picker
              label=" Scheme Type: "
              onSelect={this.updateScheme.bind(this)}
              selected={this.props.scheme}
            >
              <Picker.Item>Monochromatic (Single Color)</Picker.Item>
              <Picker.Item>Analogous (Three Colors)</Picker.Item>
              <Picker.Item>Triadic (Three Colors)</Picker.Item>
              <Picker.Item>Tetradic (Rectangle, Four Colors)</Picker.Item>
              <Picker.Item>Tetradic (Square, Four Colors)</Picker.Item>
            </Picker>
            <Text>{scheme}</Text>
            <Slider
              enabled={
                this.props.scheme !== 0 &&
                this.props.scheme !== 2 &&
                this.props.scheme !== 4
              }
              label=' Hue Difference: '
              max={359}
              min={0}
              value={this.props.theta}
              onChange={this.updateAngle.bind(this)}
            />
            <Text>Angles that are multiples of fifteen degrees are recommended.</Text>
            <Checkbox
              checked={this.props.accent}
              onToggle={this.updateAccent.bind(this)}
            >
              Add Accent Color
            </Checkbox>
            <Button
              onClick={this.printColor.bind(this)}
            >
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
    accent: state.accent,
    color: state.color,
    scheme: state.scheme,
    theta: state.theta,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainWindow);

