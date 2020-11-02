import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Attribute } from '../../models/database';
import { connectDb } from '../electron/db';
import HintInput from './HintInput';

interface Props {
    attribute?: string,
    className?: string,
    placeholder?: string,
    readOnly?: boolean,
    defaultValue?: string,
    excludeHintOnlyValues?: boolean,
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
        if (isNil(props.attribute) || props.attribute === '') {
            let result = await db.collection<Attribute>('attributes').aggregate<{ name: string }>([
                {
                    $project: {
                        name: 1,
                        _id: 0
                    }
                }
            ]).toArray();
            console.log(`loading hints with ${props.attribute}`, result)
            return result.map(h => h.name).sort();
        } else {
            let result = await db.collection<Attribute>('attributes').aggregate<{ value: string }>([
                {
                    $match: {
                        name: props.attribute
                    }
                },
                {
                    '$project': {
                        'value': [
                            '$values.value', '$defaultValue'
                        ]
                    }
                }, {
                    '$unwind': {
                        'path': '$value'
                    }
                }, {
                    '$unwind': {
                        'path': '$value'
                    }
                }, {
                    '$match': {
                        'value': {
                            '$ne': false
                        }
                    }
                }, {
                    '$group': {
                        '_id': '$value'
                    }
                }, {
                    '$project': {
                        'value': '$_id',
                        '_id': 0
                    }
                }
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