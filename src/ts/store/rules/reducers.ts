import { generateRandomString } from '../../util';
import {
    NOTIFY_RULE_ADDED,
    InputEditor,
    EditorType,
    RuleActionTypes,
    RuleState,
    UPDATE_RULE,
    ADD_EDITOR
} from './types';

const initialState: RuleState = {
    editors: []
}

export function ruleReducer(state = initialState, action: RuleActionTypes): RuleState {
    switch (action.type) {
        case ADD_EDITOR:
            return {
                ...state,
                editors: [
                    ...state.editors,
                    action.editorType === EditorType.INPUT
                        ? {
                            id: generateRandomString(6),
                            type: EditorType.INPUT,
                            isRuleAddedNotify: false,
                            currentRule: null
                        } : {
                            id: generateRandomString(6),
                            type: EditorType.IMPORTER,
                            currentFile: null
                        }
                ]
            }
        case NOTIFY_RULE_ADDED:
            return {
                ...state,
                editors: [
                    ...state.editors.filter(e => e.id !== action.editorId),
                    {
                        ...state.editors.find(e => e.id === action.editorId),
                        isRuleAddedNotify: true
                    } as InputEditor
                ]
            };
        case UPDATE_RULE:
            return {
                ...state,
                editors: [
                    ...state.editors.filter(e => e.id !== action.editorId),
                    {
                        ...state.editors.find(e => e.id === action.editorId),
                        currentRule: action.rule,
                        isRuleAddedNotify: false
                    } as InputEditor
                ]
            }
        default:
            return state;
    }
}