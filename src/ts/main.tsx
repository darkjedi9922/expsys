import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import MainWindow from './components/main-window/main-window';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <MainWindow />
        </HashRouter>
    </Provider>,
    document.getElementById("app")
);