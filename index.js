import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './src/reducers';
import { render } from 'proton-native';
import MainWindow from './src/components/mainwindow';

const store = createStore(rootReducer, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <MainWindow />
  </Provider>
);
