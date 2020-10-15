export interface Rule {
    conditions: { [parameter: string]: string },
    answer: {
        parameter: string,
        value: string
    }
}

export type RuleEditorId = string;

export const ADD_RULE_EDITOR_ID = 'ADD_RULE_EDITOR_ID';

export interface AddRuleEditorAddMessage {
    type: typeof ADD_RULE_EDITOR_ID,
    editorId: RuleEditorId
}

export interface RuleState {
    addRuleEditorIds: RuleEditorId[]
}

export type RuleActionTypes = AddRuleEditorAddMessage;