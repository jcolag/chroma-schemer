// @flow
import actionConsts from '../actiontypes';

export const setColor = color => ({
  type: actionConsts.SET_COLOR,
  color,
});

export const setScheme = scheme => ({
  type: actionConsts.SET_SCHEME,
  scheme,
});

export const setAccent = accent => ({
  type: actionConsts.SET_ACCENT,
  accent,
});

export const setAngle = angle => ({
  type: actionConsts.SET_ANGLE,
  angle,
});

export const setRestrictAngle = restrict => ({
  type: actionConsts.SET_RESTRICT_ANGLE,
  restrict,
});

