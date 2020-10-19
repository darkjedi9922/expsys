import {
    ADD_RULE_EDITOR_ID,
    RuleActionTypes,
    RuleState
} from './types';

const initialState: RuleState = {
    addRuleEditorIds: []
}

export function ruleReducer(state = initialState, action: RuleActionTypes): RuleState {
    switch (action.type) {
        case ADD_RULE_EDITOR_ID:
            return {
                ...state,
                addRuleEditorIds: [
                    ...state.addRuleEditorIds,
                    action.editorId
                ]
            };
        default:
            return state;
    }
}