import { Condition } from "../../../models/database";

import { isEmpty } from 'lodash';

export function isConditionEmpty(condition?: Condition): boolean {
    return !condition || isEmpty(condition.attribute) && isEmpty(condition.value);
}