import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connectDb } from '../electron/db';
import HintInput from './HintInput';

interface Props {
    attribute?: string,
    className?: string,
    placeholder?: string,
    readOnly?: boolean,
    defaultValue?: string,
    onlyResolvable?: boolean,
    onChange: (value: string) => void
}

export default function AttributeInput(props: Props) {
    const [hints, setHints] = useState<string[]>([]);
    const [isHintsShowed, setIsHintsShowed] = useState(false);

    useEffect(() => {
        console.log(`effect with attribute ${props.attribute}`);
        if (isHintsShowed) {
            let exists = true;
            loadHints().then(hints => {
                if (exists) setHints(hints);
            });
            return () => exists = false;
        }
    }, [isHintsShowed])

    async function loadHints(): Promise<string[]> {
        let db = await connectDb();
        if (isEmpty(props.attribute)) {
            let result = props.onlyResolvable 
                ? await db.collection('attributes')
                    .find({ 'values.conditions.0': { $exists: true } }, { projection: { name: 1, _id: 0 } })
                    .toArray()
                : await db.collection('attributes').aggregate([
                    { $unwind: '$values' },
                    { $unwind: '$values.conditions' },
                    { $project: { name: ['$name', '$values.conditions.attribute'] } },
                    { $unwind: '$name' },
                    { $group: { _id: '$name' } },
                    { $project: { _id: 0, name: '$_id' } }
                ]).toArray();
            console.log(`loading hints with ${props.attribute}`, result)
            return result.map(h => h.name).sort();
        } else {
            let result = await db.collection('attributes').aggregate([
                { $project: { _id: 0, name: 1, 'values.value': 1, defaultValue: 1 } },
                { $unwind: '$values' },
                { $project: { name: 1, value: ['$values.value', '$defaultValue'] } },
                { $unwind: '$value' },
                { $unionWith: { coll: 'attributes', pipeline: [
                    { $project: { _id: 0, 'values.conditions': 1 } },
                    { $unwind: '$values' },
                    { $project: { conditions: '$values.conditions' } },
                    { $unwind: '$conditions' },
                    { $project: { name: '$conditions.attribute', value: '$conditions.value' } }
                ]}},
                { $match: { name: props.attribute, value: { $type: 'string' } } },
                { $group: { _id: '$value' } },
                { $project: { _id: 0, value: '$_id' } }
            ]).toArray();
            console.log(`loading hints with ${props.attribute}`, result)
            return result.map(h => h.value).sort();
        }
    }

    return <HintInput hints={hints} className={props.className} readOnly={props.readOnly}
        defaultValue={props.defaultValue} placeholder={props.placeholder} onChange={props.onChange}
        onShowHints={() => {
            setIsHintsShowed(true)
        }} onHideHints={() => {
            setIsHintsShowed(false);
        }} />
}