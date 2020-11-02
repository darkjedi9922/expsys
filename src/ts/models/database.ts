import { ObjectId } from "mongodb";

export interface ParamValue {
    parameter: string,
    value: string
}

export interface Rule {
    _id?: ObjectId,
    answer: ParamValue,
    conditions: { [parameter: string]: string }
}

export interface Condition {
    attribute: string,
    value: string
}

export interface AttributeValue {
    value: string,
    asHintOnly?: boolean,
    conditions: Condition[]
}

export interface Attribute {
    _id?: ObjectId,
    name: string,
    values: AttributeValue[],
    defaultValue?: string
}