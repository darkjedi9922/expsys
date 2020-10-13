import { createStore } from 'redux'

export interface AppState {}

const initialState: AppState = {};

const appReducer = function(state = initialState, action): AppState {
    let newState = {...state};
    switch (action.type) {
        
    }
    return newState;
}

const store = createStore(appReducer);
export default store;