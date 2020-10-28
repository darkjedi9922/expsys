export const MESSAGE_ASK = 'MESSAGE_ASK';
export const MESSAGE_ANSWER = 'MESSAGE_ANSWER';
export const MESSAGE_HINT = 'MESSAGE_HINT';

export interface AskMessage {
    type: typeof MESSAGE_ASK,
    attribute: string
}

export interface AnswerMessage {
    type: typeof MESSAGE_ANSWER,
    value: string
}

export interface HintMessage {
    type: typeof MESSAGE_HINT;
    value?: string
}

export type Message = AskMessage | AnswerMessage | HintMessage;