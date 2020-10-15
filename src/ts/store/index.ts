import { applyMiddleware, combineReducers, createStore } from "redux";
import { ruleReducer } from "./rules/reducers";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    rules: ruleReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default createStore(rootReducer, applyMiddleware(thunk))