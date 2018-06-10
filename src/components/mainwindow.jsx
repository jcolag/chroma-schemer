import React, { Component } from 'react';
import {
  App,
  Area,
  Button,
  Checkbox,
  ColorButton,
  Dialog,
  Form,
  Picker,
  Slider,
  Text,
  Window,
} from 'proton-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fs from 'fs';
import * as Actions from '../actions';

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
    if (this.props.restrictAngle && angle % 15 === 0) {
      return;
    }
    this.props.setAngle(angle);
    if (this.props.restrictAngle) {
      const th = Math.trunc(angle / 15) * 15;
      this.props.setAngle(th);
    }
  }

  updateRestrictAngle(restrict) {
    this.props.setRestrictAngle(restrict);
  }

  hslBare(color) {
    return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
  }

  hsl(name, h, s, l) {
    return `  --${name}: hsl(${h}, ${s}%, ${l}%);\n`;
  }

  generateShades(prefix, h, s, l) {
    const result = [];
    let step = l > 25 ? 12 : ((l / 2) - 1);
    result.push({
      name: `${prefix}-darker`, h, s, l: l - (step * 2)
    });
    result.push({
      name: `${prefix}-dark`, h, s, l: l - step
    });
    result.push({
      name: prefix, h, s, l
    });
    step = l < 75 ? 12 : (((100 - l) / 2) - 1);
    result.push({
      name: `${prefix}-light`, h, s, l: l + step
    });
    result.push({
      name: `${prefix}-lighter`, h, s, l: l + (step * 2)
    });
    return result;
  }

  generateColors() {
    const colors = [];
    const { h, s, l } = this.props.color;
    let th = this.props.theta;
    switch (this.props.scheme) {
      case 0:
      case 1:
      case 3:
      default:
        break;
      case 2:
        th = 120;
        break;
      case 4:
        th = 90;
        break;
    }
    Array.prototype.push.apply(colors, this.generateShades('base-color', h, s, l));
    const altH = (h + (this.props.scheme === 0 ? 0 : th)) % 360;
    Array.prototype.push.apply(colors, this.generateShades('alt-color', altH, s, l));
    let angle = 0;
    switch (this.props.scheme) {
      case 0:
      default:
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
    const thirdH = (h + angle + 360) % 360;
    Array.prototype.push.apply(colors, this.generateShades('third-color', thirdH, s, l));
    const comp = this.props.accent || this.props.scheme === 4;
    const accentH = (h + (comp ? 180 : 0)) % 360;
    Array.prototype.push.apply(colors, this.generateShades('accent-color', accentH, s, l));
    return colors;
  }

  printColor() {
    let filename = '';
    try {
      filename = Dialog('Save');
    } catch (e) {
      // Probably just canceled the dialog
      return;
    }
    const colors = this.generateColors();
    let css = 'html {\n  /* Use with, for example, "var(--base-color)" */\n';
    for (let i = 0; i < colors.length; i += 1) {
      const c = colors[i];
      css += this.hsl(c.name, c.h, c.s, c.l);
    }
    css += '}';
    try {
      fs.writeFileSync(filename, css);
    } catch (e) {
      Dialog('error', { description: e });
    }
  }

  render() {
    const c = this.generateColors();
    let scheme = '';
    switch (this.props.scheme) {
      case 0:
        scheme = 'Colors will all have the same hue.';
        break;
      case 1:
        scheme = 'Colors are clustered and spaced equally from each other on the color wheel.';
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
    const base = this.props.color;
    return (
      <App>
        <Window title="Color Schemer" size={{ w: 750, h: 450 }} menuBar={false}>
          <Form row={0} column={0}>
            <ColorButton
              color={`rgba(${base.r}, ${base.g}, ${base.b}, ${base.a})`}
              label=" Base Color: "
              onChange={this.updateColor.bind(this)}
            />
            <Picker
              label=" Scheme Type: "
              onSelect={this.updateScheme.bind(this)}
              selected={this.props.scheme}
              stretchy={false}
            >
              <Picker.Item>Monochromatic (Single Color)</Picker.Item>
              <Picker.Item>Analogous (Three Colors)</Picker.Item>
              <Picker.Item>Triadic (Three Colors)</Picker.Item>
              <Picker.Item>Tetradic (Rectangle, Four Colors)</Picker.Item>
              <Picker.Item>Tetradic (Square, Four Colors)</Picker.Item>
            </Picker>
            <Text stretchy={false}>{scheme}</Text>
            <Slider
              enabled={
                this.props.scheme !== 0 &&
                this.props.scheme !== 2 &&
                this.props.scheme !== 4
              }
              label=" Hue Difference: "
              max={359}
              min={0}
              value={this.props.theta}
              onChange={this.updateAngle.bind(this)}
              stretchy={false}
            />
            <Checkbox
              checked={this.props.restrictAngle}
              onToggle={this.updateRestrictAngle.bind(this)}
              stretchy={false}
            >
              Limit angles to multiples of fifteen degrees (Recommended)
            </Checkbox>
            <Checkbox
              checked={this.props.accent}
              onToggle={this.updateAccent.bind(this)}
              stretchy={false}
            >
              Add Accent Color
            </Checkbox>
            <Area
              label=" Sample: "
            >
              <Area.Rectangle
                x="0%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[0])}
              />
              <Area.Rectangle
                x="10%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[1])}
              />
              <Area.Rectangle
                x="20%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[2])}
              />
              <Area.Rectangle
                x="30%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[3])}
              />
              <Area.Rectangle
                x="40%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[4])}
              />
              <Area.Rectangle
                x="50%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[5])}
              />
              <Area.Rectangle
                x="60%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[6])}
              />
              <Area.Rectangle
                x="70%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[7])}
              />
              <Area.Rectangle
                x="80%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[8])}
              />
              <Area.Rectangle
                x="90%"
                y="0%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[9])}
              />
              <Area.Rectangle
                x="0%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[10])}
              />
              <Area.Rectangle
                x="10%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[11])}
              />
              <Area.Rectangle
                x="20%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[12])}
              />
              <Area.Rectangle
                x="30%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[13])}
              />
              <Area.Rectangle
                x="40%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[14])}
              />
              <Area.Rectangle
                x="50%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[15])}
              />
              <Area.Rectangle
                x="60%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[16])}
              />
              <Area.Rectangle
                x="70%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[17])}
              />
              <Area.Rectangle
                x="80%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[18])}
              />
              <Area.Rectangle
                x="90%"
                y="50%"
                width="10%"
                height="50%"
                fill={this.hslBare(c[19])}
              />
            </Area>
            <Button
              onClick={this.printColor.bind(this)}
            >
              Generate Color Scheme As CSS
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
    restrictAngle: state.restrictAngle,
    theta: state.theta,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainWindow);
