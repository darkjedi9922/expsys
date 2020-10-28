import { getUniqueIndex } from '../../../common/util';
import {
    NOTIFY_RULE_ADDED,
    InputEditor,
    EditorType,
    RuleActionTypes,
    RuleState,
    UPDATE_RULE,
    ADD_EDITOR,
    IMPORT_FILE,
    ImportEditor,
    INDUCT_RULES
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
                            id: getUniqueIndex(),
                            type: EditorType.INPUT,
                            isRuleAddedNotify: false,
                        } : {
                            id: getUniqueIndex(),
                            type: EditorType.IMPORTER,
                            isRuleAddedNotify: false
                        }
                ]
            };
        case IMPORT_FILE:
            return {
                ...state,
                editors: [
                    ...state.editors.filter(e => e.id !== action.importerId),
                    {
                        ...state.editors.find(e => e.id === action.importerId),
                        currentFile: action.file
                    } as ImportEditor
                ]
            };
        case INDUCT_RULES:
            return {
                ...state,
                editors: [
                    ...state.editors.filter(e => e.id !== action.importerId),
                    {
                        ...state.editors.find(e => e.id === action.importerId),
                        generatedRules: action.rules
                    } as ImportEditor
                ]
            };
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