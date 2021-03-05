import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from "redux";
import {rootReducer} from "./redux/rootReducer";
import App from './components/App';
import {Provider} from 'react-redux';
import './index.scss';
import thunk from 'redux-thunk';
import { recordsMiddleware } from './redux/records/recordsMiddleware';
import { balanceMiddleware } from './redux/balance/balanceMiddleware';

async function start() {
  const store = createStore(rootReducer, compose(
    applyMiddleware(
      thunk,
      recordsMiddleware,
      balanceMiddleware,
    ),
    // @ts-ignore
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ));

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App/>
      </Provider>
    </React.StrictMode>,
    document.getElementById('app')
  );
}

start();

