import actionConsts from '../actiontypes';

const defaultState = {
  accent: true,
  color: {
    r: 255,
    g: 0,
    b: 0,
    h: 0,
    s: 100,
    l: 100,
    a: 1,
  },
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
      return { ...state, color: c };
    case actionConsts.SET_SCHEME:
      return { ...state, scheme: Number(action.scheme) };
    default:
      return state;
  }
};

export default get;

