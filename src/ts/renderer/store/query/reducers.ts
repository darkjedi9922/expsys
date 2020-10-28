import { MESSAGE_ANSWER, MESSAGE_ASK, MESSAGE_HINT } from '../../../models/dialog';
import {
    ASK_ACTION,
    ANSWER_ACTION,
    QueryActionTypes,
    QueryState,
    HINT_ACTION,
    QUERY_ACTION
} from './types';

const initialState: QueryState = {
    aimAttribute: null,
    askingHintAttribute: null,
    answer: null,
    messages: [],
    queringCompleted: false
}

export function queryReducer(state = initialState, action: QueryActionTypes): QueryState {
    switch (action.type) {
        case ASK_ACTION:
            return {
                ...state,
                askingHintAttribute: action.attribute,
                answer: null,
                messages: [
                    ...state.messages,
                    {
                        type: MESSAGE_ASK,
                        attribute: action.attribute
                    }
                ],
                queringCompleted: false
            };
        case ANSWER_ACTION:
            return {
                ...state,
                askingHintAttribute: null,
                answer: action.value,
                messages: [
                    ...state.messages,
                    {
                        type: MESSAGE_ANSWER,
                        value: action.value
                    }
                ],
                queringCompleted: true
            };
        case HINT_ACTION:
            return {
                ...state,
                messages: [
                    ...state.messages,
                    {
                        type: MESSAGE_HINT,
                        value: action.value
                    }
                ]
            }
        case QUERY_ACTION:
            return {
                ...state,
                aimAttribute: action.attribute,
                answer: null,
                messages: [],
                queringCompleted: false
            }
        default:
            return state;
    }
}