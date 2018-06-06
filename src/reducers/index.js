import actionConsts from '../actiontypes';

const defaultState = {
  accent: true,
  color: {
    r: 255,
    g: 0,
    b: 0,
    h: 0,
    s: 100,
    l: 50,
    a: 1,
  },
  restrictAngle: true,
  scheme: 0,
  theta: 30,
};

const get = (state = defaultState, action) => {
  switch (action.type) {
    case actionConsts.SET_ACCENT:
      return { ...state, accent: action.accent };
    case actionConsts.SET_ANGLE:
      return { ...state, theta: action.angle };
    case actionConsts.SET_COLOR:
      let c = action.color;
      let r = c.r / 255;
      let g = c.g / 255;
      let b = c.b / 255;
      let min = Math.min(r, g, b);
      let max = Math.max(r, g, b);
      c.l = (max + min) / 2;
      if (min === max) {
        c.h = 0;
        c.s = 0;
      } else {
        let d = max - min;
        c.s = c.l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            c.h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            c.h = (b - r) / d + 2;
            break;
          case b:
            c.h = (r - g) / d + 4;
            break;
        }
        c.h /= 6;
      }
      c.h *= 360;
      c.s *= 100;
      c.l *= 100;
      return { ...state, color: c };
    case actionConsts.SET_RESTRICT_ANGLE:
      return { ...state, restrictAngle: action.restrict };
    case actionConsts.SET_SCHEME:
      return { ...state, scheme: Number(action.scheme) };
    default:
      return state;
  }
};

export default get;

