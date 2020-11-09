import { isNil } from 'lodash';
import { connectDb } from '../renderer/electron/db';
import { Attribute } from '../models/database';
import {
    AnswerMessage,
    AskMessage,
    DefaultAnswerMessage,
    Message,
    MESSAGE_ANSWER,
    MESSAGE_ANSWER_DEFAULT,
    MESSAGE_ASK,
    MESSAGE_RESOLVED,
    ValueResolvedMessage
} from '../models/dialog';

type Context = { [parameter: string]: string }

export type Resolver = AsyncGenerator<Message, AnswerMessage | DefaultAnswerMessage, string>;

export default async function* resolveRecursively(attributeName: string,
    context: Context = {}, searchingAttributes: { [attr: string]: boolean } = {}): Resolver {
    console.log(`Finding attribute ${attributeName}`);
    if (!isNil(context[attributeName])) return {
        type: MESSAGE_ANSWER,
        value: context[attributeName]
    } as AnswerMessage;

    searchingAttributes[attributeName] = true;

    // At this point attribute value is unknown
    let db = await connectDb();
    let attribute = await db.collection<Attribute>('attributes').findOne({'name': attributeName });
    if (attribute) {
        let values = attribute.values;
        for (let i = 0; i < values.length; ++i) {
            let value = values[i];
            let ruleIsTrue = true;
            console.log('Handling value', value);
            for (let j = 0; j < value.conditions.length; ++j) {
                let condition = value.conditions[j];
                if (context[condition.attribute] === undefined) {
                    let hint: string | null = yield {
                        type: MESSAGE_ASK,
                        attribute: condition.attribute
                    } as AskMessage;
                    context[condition.attribute] = hint;
                    if (hint === null) {
                        console.log('searched attributes', searchingAttributes);
                        if (!searchingAttributes[condition.attribute]) {
                            console.log(`Need to find attribute ${condition.attribute}`);
                            let resolvedValue = yield* resolveRecursively(condition.attribute, context, searchingAttributes);
                            console.log('Finded value', resolvedValue.value);
                        }
                    }
                }

                if (context[condition.attribute] !== condition.value) {
                    console.log('Rule is false', value);
                    ruleIsTrue = false;
                    break;
                }
            }
            if (ruleIsTrue) {
                console.log('Rule is true', value);
                delete searchingAttributes[attributeName];
                context[attributeName] = value.value;
                yield {
                    type: MESSAGE_RESOLVED,
                    attribute: attributeName,
                    value: value
                } as ValueResolvedMessage;
                return {
                    type: MESSAGE_ANSWER,
                    value: value.value
                } as AnswerMessage;
            }
        }
    }

    delete searchingAttributes[attributeName];
    console.log(`After removing ${attributeName}`, searchingAttributes);

    return {
        type: MESSAGE_ANSWER_DEFAULT,
        value: attribute && attribute.defaultValue || null
    } as DefaultAnswerMessage;
}