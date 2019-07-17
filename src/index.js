import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './redux/reducers';
import './styles/sass/index.scss';
import { identifyBrowser, initializeAuth } from './redux/actions';
import App from './components/App';

const store = createStore(
  reducers,
  {},
  applyMiddleware(thunk)
);

initializeAuth(store.dispatch);
identifyBrowser(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>  
, document.getElementById('root'));