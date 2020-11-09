import { AttributeValue } from "./database";

export const MESSAGE_ASK = 'MESSAGE_ASK';
export const MESSAGE_ANSWER = 'MESSAGE_ANSWER';
export const MESSAGE_HINT = 'MESSAGE_HINT';
export const MESSAGE_RESOLVED = 'MESSAGE_RESOLVED';
export const MESSAGE_ANSWER_DEFAULT = 'MESSAGE_ANSWER_DEFAULT';

export interface AskMessage {
    type: typeof MESSAGE_ASK,
    attribute: string
}

export interface AnswerMessage {
    type: typeof MESSAGE_ANSWER,
    value: string
}

export interface DefaultAnswerMessage {
    type: typeof MESSAGE_ANSWER_DEFAULT,
    value?: string
}

export interface HintMessage {
    type: typeof MESSAGE_HINT;
    value?: string
}

export interface ValueResolvedMessage {
    type: typeof MESSAGE_RESOLVED,
    attribute: string,
    value: AttributeValue
}

export type Message = AskMessage | AnswerMessage | HintMessage | ValueResolvedMessage
    | DefaultAnswerMessage;