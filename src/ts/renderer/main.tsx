import React from 'react';
import ReactDOM from 'react-dom';
import MainWindow from './components/windows/MainWindow';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
    <HashRouter>
        <MainWindow />
    </HashRouter>,
    document.getElementById("app")
);