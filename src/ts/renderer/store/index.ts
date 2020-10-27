import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { ruleReducer } from './rules/reducers';
import { queryReducer } from './query/reducers';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    rules: ruleReducer,
    query: queryReducer
})

const composedEnhancers = compose(
    applyMiddleware(thunk),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
        && (window as any).__REDUX_DEVTOOLS_EXTENSION__())

export type RootState = ReturnType<typeof rootReducer>
export default createStore(rootReducer, undefined, composedEnhancers);