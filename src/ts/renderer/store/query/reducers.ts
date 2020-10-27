import {
    ASK_ACTION,
    ANSWER_ACTION,
    QueryActionTypes,
    QueryState
} from './types';

const initialState: QueryState = {
    askingAttribute: null,
    answer: null,
    queringCompleted: false
}

export function queryReducer(state = initialState, action: QueryActionTypes): QueryState {
    switch (action.type) {
        case ASK_ACTION:
            return {
                ...state,
                askingAttribute: action.attribute,
                answer: null,
                queringCompleted: false
            };
        case ANSWER_ACTION:
            return {
                ...state,
                askingAttribute: null,
                answer: action.value,
                queringCompleted: true
            };
        default:
            return state;
    }
}