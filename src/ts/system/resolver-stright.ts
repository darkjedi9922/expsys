import { isNil } from 'lodash';
import { connectDb } from '../renderer/electron/db';
import { Attribute, Rule } from '../models/database';

type Context = { [parameter: string]: string }

export default async function* resolveRecursively(attributeName: string,
    context: Context = {}, searchingAttributes: { [attr: string]: boolean } = {}):
    AsyncGenerator<string, string, string> {
    console.log(`Finding attribute ${attributeName}`);
    if (!isNil(context[attributeName])) return context[attributeName];

    searchingAttributes[attributeName] = true;

    // At this point attribute value is unknown
    let db = await connectDb();
    let attribute = await db.collection<Attribute>('attributes').findOne({'name': attributeName });
    if (attribute) {
        let values = attribute.values;
        for (let i = 0; i < values.length; ++i) {
            let value = values[i];
            if (value.asHintOnly) continue;
            let ruleIsTrue = true;
            console.log('Handling value', value);
            for (let j = 0; j < value.conditions.length; ++j) {
                let condition = value.conditions[j];
                if (context[condition.attribute] === undefined) {
                    let hint: string | null = yield condition.attribute;
                    context[condition.attribute] = hint;
                    if (hint === null) {
                        let resolvedValue = undefined;
                        console.log('searched attributes', searchingAttributes);
                        if (!searchingAttributes[condition.attribute]) {
                            console.log(`Need to find attribute ${condition.attribute}`);
                            resolvedValue = yield* resolveRecursively(condition.attribute, context, searchingAttributes);
                            console.log('Finded value', resolvedValue);
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
                return value.value;
            }
        }
    }

    delete searchingAttributes[attributeName];
    console.log(`After removing ${attributeName}`, searchingAttributes);

    return attribute && attribute.defaultValue || null;
}