import { Db, ObjectId } from 'mongodb';
import { connectDb } from './db';

type Rule = {
    _id: ObjectId,
    answer: {
        parameter: string,
        value: string
    },
    conditions: { [parameter: string]: string }
}

type Context = { [parameter: string]: string }

async function findRule(db: Db, aim: string, blocked: ObjectId[]): Promise<Rule|null> {
    console.log('Finding in db');
    let result = await db.collection<Rule>('rules').findOne({
        'answer.parameter': aim,
        _id: { $nin: blocked }
    });
    console.log('Found in db');
    return result;
}

function isRuleTrue(rule: Rule, context: Context): boolean {
    for (const cond in rule.conditions) {
        if (!Object.keys(context).includes(cond)) return false;
        if (rule.conditions[cond] !== context[cond]) return false;
    }
    return true;
}

function isRuleFalse(rule: Rule, context: Context): boolean {
    for (const cond in rule.conditions) {
        if (!Object.keys(context).includes(cond)) return false;
        if (rule.conditions[cond] !== context[cond]) return true;
    }
    return false;
}

function findUnknownAttr(rule: Rule, context: Context): string | null {
    for (const cond in rule.conditions) {
        if (!Object.keys(context).includes(cond)) return cond;
    }
    return null;
}

export default async function * resolve(attribute: string) {
    console.log('Connecting to db');
    let db = await connectDb();
    console.log('Connected to db');
    let context: Context = {};
    let aims: string[] = [attribute];
    let blocked: ObjectId[] = [];

    while (aims.length !== 0) {
        let currentAim = aims[0];
        let rule = await findRule(db, currentAim, blocked);
        if (rule !== null) {
            if (isRuleTrue(rule, context)) {
                context[currentAim] = rule.answer.value;
                aims.shift();
                if (aims.length === 0) {
                    return context[currentAim];
                }
            } else if (isRuleFalse(rule, context)) {
                blocked.push(rule._id);
            } else {
                let unknownAttr = findUnknownAttr(rule, context);
                aims.unshift(unknownAttr);
            }
        } else {
            let hint: string | null = yield currentAim;
            if (hint !== null) {
                context[currentAim] = hint;
            } else {
                if (aims.length === 1) {
                    return null;
                } else {
                    context[currentAim] = null;
                }
            }
            aims.shift();
        }
    }
}