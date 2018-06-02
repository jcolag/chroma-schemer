import actionConsts from '../actiontypes';

const defaultState = {
  color: {
    r: 127,
    g: 127,
    b: 127,
    a: 1,
  },
};

const get = (state = defaultState, action) => {
  switch (action.type) {
    case actionConsts.SET_COLOR:
      return { ...state, color: action.color };
    default:
      return state;
  }
};

export default get;

