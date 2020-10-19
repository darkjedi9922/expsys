import { applyMiddleware, combineReducers, createStore } from 'redux';
import { ruleReducer } from './rules/reducers';
import { queryReducer } from './query/reducers';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    rules: ruleReducer,
    query: queryReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default createStore(rootReducer, applyMiddleware(thunk))