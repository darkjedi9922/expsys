import { isNil } from 'lodash';
import { connectDb } from '../renderer/electron/db';
import { Rule } from '../models/database';

type Context = { [parameter: string]: string }

export default async function* resolveRecursively(attribute: string,
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
            if (!context[cond] && context[cond] !== null) {
                let hint: string | null = yield cond;
                context[cond] = hint;
                if (hint === null) {
                    let resolvedValue = undefined;
                    console.log('searched attributes', searchingAttributes);
                    if (!searchingAttributes[cond]) {
                        console.log(`Need to find attribute ${cond}`);
                        resolvedValue = yield* resolveRecursively(cond, context, searchingAttributes);
                        console.log('Finded value', resolvedValue);
                    }
                }
            }

            const ruleCondValue = rule.conditions[cond];
            if (context[cond] !== ruleCondValue) {
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

    // We don't know
    return null;
}