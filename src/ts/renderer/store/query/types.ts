export const ASK_ACTION = 'ASK_ACTION';
export const ANSWER_ACTION = 'ANSWER_ACTION';

export interface AskAction {
    type: typeof ASK_ACTION;
    attribute: string
}

export interface ResultAnswerAction {
    type: typeof ANSWER_ACTION;
    value?: string
}

export interface QueryState {
    askingAttribute?: string,
    answer?: string,
    queringCompleted: boolean
}

export type QueryActionTypes = AskAction | ResultAnswerAction;