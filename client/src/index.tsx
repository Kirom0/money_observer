import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from "redux";
import {rootReducer} from "./redux/rootReducer";
import App from './components/App';
import {Provider} from 'react-redux';
import './index.scss';
import { getAuthentication } from './core/authentication';
import thunk from 'redux-thunk';
import { recordsMiddleware } from './redux/records/recordsMiddleware';

async function start() {
  const authData = await getAuthentication();
  const store = createStore(rootReducer, compose(
    applyMiddleware(
      thunk,
      recordsMiddleware
    ),
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ));

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App authData={authData}/>
      </Provider>
    </React.StrictMode>,
    document.getElementById('app')
  );
}

start();

