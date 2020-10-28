import { Message } from "../../../models/dialog";

export const ASK_ACTION = 'ASK_ACTION';
export const ANSWER_ACTION = 'ANSWER_ACTION';
export const HINT_ACTION = 'HINT_ACTION';
export const QUERY_ACTION = 'QUERY_ACTION';

export interface QueryAction {
    type: typeof QUERY_ACTION,
    attribute: string
}

export interface AskAction {
    type: typeof ASK_ACTION;
    attribute: string
}

export interface HintAction {
    type: typeof HINT_ACTION;
    value: string
}

export interface ResultAnswerAction {
    type: typeof ANSWER_ACTION;
    value?: string
}

export interface QueryState {
    aimAttribute?: string,
    askingHintAttribute?: string,
    answer?: string,
    messages: Message[],
    queringCompleted: boolean
}

export type QueryActionTypes = AskAction | HintAction | ResultAnswerAction | QueryAction;