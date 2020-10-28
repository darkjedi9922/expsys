import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { RootState } from "..";
import { ANSWER_ACTION, ASK_ACTION, HINT_ACTION, QueryActionTypes, QUERY_ACTION } from "./types";
import resolver from '../../../system/resolver-stright';

let resolveGenerator: AsyncGenerator<string, string, string> = null;

export function startQuery(attribute: string):
    ThunkAction<void, RootState, unknown, QueryActionTypes> {
    return async (dispatch) => {
        dispatch({
            type: QUERY_ACTION,
            attribute: attribute
        });
        resolveGenerator = resolver(attribute);
        handleResolverMessage(await resolveGenerator.next(), dispatch);
    }
}

export function answerHint(value?: string):
    ThunkAction<void, RootState, unknown, QueryActionTypes> {
    return async (dispatch) => {
        dispatch({
            type: HINT_ACTION,
            value: value
        });
        handleResolverMessage(await resolveGenerator.next(value), dispatch);
    }
}

function handleResolverMessage(message: IteratorResult<string, string>,
    dispatch: ThunkDispatch<RootState, unknown, QueryActionTypes>) {
    if (message.done) {
        dispatch({
            type: ANSWER_ACTION,
            value: message.value
        });
        resolveGenerator = null;
    } else {
        dispatch({
            type: ASK_ACTION,
            attribute: message.value
        });
    }
} 