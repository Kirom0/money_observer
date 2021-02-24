import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {Provider} from 'react-redux';
import './index.scss';
import {compose, createStore} from "redux";
import {rootReducer} from "./redux/rootReducer";


const store = createStore(rootReducer, compose(
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
));

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>,
    </React.StrictMode>,
    document.getElementById('app')
);
