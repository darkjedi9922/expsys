import { ThunkAction } from "redux-thunk";
import { connectDb } from "../../electron/db";
import { RootState } from "..";
import { 
    ADD_EDITOR,
    EditorType,
    IMPORT_FILE,
    INDUCT_RULES,
    NOTIFY_RULE_ADDED,
    Rule,
    RuleActionTypes,
    UPDATE_RULE
} from "./types";
import * as fs from '../../electron/fs'; 
import generateProductionRules from '../../../system/inductor';
import papaparse from 'papaparse';
import { isNil } from "lodash";

export function addEditor(editorType: EditorType): RuleActionTypes {
    return {
        type: ADD_EDITOR,
        editorType
    }
}

export function submitAddRule(editorId: number): 
    ThunkAction<void, RootState, unknown, RuleActionTypes> {
    return async (dispatch, getState) => {
        let db = await connectDb();
        let editor = getState().rules.editors.find(e => e.id === editorId);
        switch (editor.type) {
            case EditorType.INPUT:
                await db.collection<Rule>('rules').insertOne(editor.currentRule);
                break;
            case EditorType.IMPORTER:
                (editor.generatedRules || []).forEach(async rule => {
                    if (await db.collection<Rule>('rules').countDocuments(rule) === 0) {
                        await db.collection<Rule>('rules').insertOne(rule);
                    }
                })
                break;
            default:
                break;    
        }
        dispatch({
            type: NOTIFY_RULE_ADDED,
            editorId
        });
    }
}

export function updateRule(inputEditorId: number, rule: Rule): RuleActionTypes {
    return {
        type: UPDATE_RULE,
        editorId: inputEditorId,
        rule
    }
}

export function importFile(importerId: number, file?: string): 
    ThunkAction<void, RootState, unknown, RuleActionTypes> {
    return async (dispatch) => {
        dispatch({
            type: IMPORT_FILE,
            importerId,
            file
        });

        let csvData = !isNil(file) 
            ? papaparse.parse<string[]>(await fs.readFile(file)).data
            : null;

        dispatch({
            type: INDUCT_RULES,
            importerId,
            rules: !isNil(file) ? generateProductionRules(csvData[0], csvData.slice(1), 0).map(rule => ({
                conditions: rule[2],
                answer: {
                    parameter: rule[0],
                    value: rule[1]
                }
            })) : null
        })
    }
}