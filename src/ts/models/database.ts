import { ObjectId } from "mongodb";

export type Rule = {
    _id: ObjectId,
    answer: {
        parameter: string,
        value: string
    },
    conditions: { [parameter: string]: string }
}

export interface Condition {
    name: string,
    value: string
}

export interface AttributeValue {
    value: string,
    conditions: Condition[]
}

export interface Attribute {
    _id: ObjectId,
    name: string,
    values: AttributeValue[],
    defaultValue?: string
}