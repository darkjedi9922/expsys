import { isNil } from 'lodash';
import { ObjectId } from 'mongodb';
import { connectDb } from './electron/renderer/db';

type Rule = {
    _id: ObjectId,
    answer: {
        parameter: string,
        value: string
    },
    conditions: { [parameter: string]: string }
}

type Context = { [parameter: string]: string }

export default async function * resolveRecursively(attribute: string,
    context: Context = {}, searchingAttributes: { [attr: string]: boolean } = {}):
    AsyncGenerator<string, string, string> {
    console.log(`Finding attribute ${attribute}`);
    if (!isNil(context[attribute])) return context[attribute];

    searchingAttributes[attribute] = true;
    
    // At this point attribute value is unknown
    let db = await connectDb();
    let rules = db.collection<Rule>('rules').find({ 'answer.parameter': attribute });
    while (await rules.hasNext()) {
        let rule = await rules.next();
        let ruleIsTrue = true;
        console.log('Handling rule', rule);
        for (const cond in rule.conditions) {
            const ruleCondValue = rule.conditions[cond];
            let resolvedValue = undefined;
            console.log('searched attributes', searchingAttributes);
            if (!searchingAttributes[cond]) {
                console.log(`Need to find attribute ${cond}`);
                resolvedValue = yield *resolveRecursively(cond, context, searchingAttributes);
                console.log('Finded value', resolvedValue);
            }
            if (resolvedValue !== ruleCondValue) {
                console.log('Rule is false', rule);
                ruleIsTrue = false;
                break;
            }
        }
        if (ruleIsTrue) {
            console.log('Rule is true', rule);
            delete searchingAttributes[attribute];
            context[attribute] = rule.answer.value;
            return rule.answer.value;
        }
    }

    delete searchingAttributes[attribute];
    console.log(`After removing ${attribute}`, searchingAttributes);

    // At this point no rules are true, we need more information
    // Ask if we have not already asked (null value notifies that we asked before)
    if (context[attribute] !== null) {
        let hint: string | null = yield attribute;
        context[attribute] = hint;
        return hint;
    }

    // We don't know
    return null;
}