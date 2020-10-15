import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import MainWindow from './components/main-window/main-window';

ReactDOM.render(
    <Provider store={store}><MainWindow/></Provider>,
    document.getElementById("app")
);