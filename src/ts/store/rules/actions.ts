import { ThunkAction } from "redux-thunk";
import { connectDb } from "../../db";
import { RootState } from "..";
import { ADD_RULE_EDITOR_ID, Rule, RuleActionTypes, RuleEditorId } from "./types";

export function addRule(editorId: RuleEditorId, rule: Rule): 
    ThunkAction<void, RootState, unknown, RuleActionTypes> {
    return async (dispatch) => {
        let db = await connectDb();
        await db.collection('rules').insertOne(rule);
        dispatch({
            type: ADD_RULE_EDITOR_ID,
            editorId
        });
    }
}