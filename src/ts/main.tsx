import React from 'react';
import ReactDOM from 'react-dom';
import RuleAddWindow from './components/rule-add-window/rule-add-window';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
    <Provider store={store}><RuleAddWindow/></Provider>,
    document.getElementById("app")
);