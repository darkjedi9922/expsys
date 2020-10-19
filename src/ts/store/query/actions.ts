import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { RootState } from "..";
import { ANSWER_ACTION, ASK_ACTION, QueryActionTypes } from "./types";
import resolver from '../../resolver';

let resolveGenerator: AsyncGenerator<string, string, string> = null;

export function startQuery(attribute: string):
    ThunkAction<void, RootState, unknown, QueryActionTypes> {
    return async (dispatch) => {
        resolveGenerator = resolver(attribute);
        handleResolverMessage(await resolveGenerator.next(), dispatch);
    }
}

export function answerHint(value?: string):
    ThunkAction<void, RootState, unknown, QueryActionTypes> {
    return async (dispatch) => {
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