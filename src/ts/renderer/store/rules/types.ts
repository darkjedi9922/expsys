export interface Attribute {
    parameter: string,
    value: string
}

export interface Rule {
    conditions: { [parameter: string]: string },
    answer: Attribute
}

export enum EditorType {
    INPUT = 'INPUT',
    IMPORTER = 'IMPORTER'
}

export interface InputEditor {
    id: number,
    type: typeof EditorType.INPUT,
    isRuleAddedNotify: boolean,
    currentRule?: Rule
}

export interface ImportEditor {
    id: number,
    type: typeof EditorType.IMPORTER,
    currentFile?: string,
    generatedRules?: Rule[],
    isRuleAddedNotify: boolean,
}

export type Editor = InputEditor | ImportEditor;

export const ADD_EDITOR = 'ADD_EDITOR';
export const IMPORT_FILE = 'IMPORT_FILE';
export const INDUCT_RULES = 'INDUCT_RULES';
export const NOTIFY_RULE_ADDED = 'NOTIFY_RULE_ADDED';
export const UPDATE_RULE = 'UPDATE_RULE';

export interface AddEditor {
    type: typeof ADD_EDITOR,
    editorType: EditorType
}

export interface ImportFile {
    type: typeof IMPORT_FILE,
    importerId: number,
    file?: string
}

export interface InductRules {
    type: typeof INDUCT_RULES,
    importerId: number,
    rules: Rule[]
}

export interface NotifyRuleAdded {
    type: typeof NOTIFY_RULE_ADDED,
    editorId: number
}

export interface UpdateRule {
    type: typeof UPDATE_RULE,
    editorId: number,
    rule: Rule
}

export interface RuleState {
    editors: Editor[]
}

export type RuleActionTypes = AddEditor | ImportFile | InductRules | NotifyRuleAdded
    | UpdateRule;