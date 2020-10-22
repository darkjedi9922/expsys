import { ThunkAction } from "redux-thunk";
import { connectDb } from "../../electron/renderer/db";
import { RootState } from "..";
import { 
    ADD_EDITOR,
    EditorType,
    IMPORT_FILE,
    NOTIFY_RULE_ADDED,
    Rule,
    RuleActionTypes,
    RuleEditorId,
    UPDATE_RULE
} from "./types";

export function addEditor(editorType: EditorType): RuleActionTypes {
    return {
        type: ADD_EDITOR,
        editorType
    }
}

export function submitAddRule(editorId: RuleEditorId): 
    ThunkAction<void, RootState, unknown, RuleActionTypes> {
    return async (dispatch, getState) => {
        let db = await connectDb();
        let editor = getState().rules.editors.find(e => e.id === editorId);
        if (editor.type === EditorType.INPUT) {
            await db.collection('rules').insertOne(editor.currentRule);
        }
        dispatch({
            type: NOTIFY_RULE_ADDED,
            editorId
        });
    }
}

export function updateRule(inputEditorId: RuleEditorId, rule: Rule): RuleActionTypes {
    return {
        type: UPDATE_RULE,
        editorId: inputEditorId,
        rule
    }
}

export function importFile(importerId: RuleEditorId, file?: string): RuleActionTypes {
    return {
        type: IMPORT_FILE,
        importerId,
        file
    }
}