import { isNil } from 'lodash';
import React from 'react';
import { connectDb } from '../electron/db';
import HintInput from './HintInput';

interface Props {
    attribute?: string,
    className?: string,
    placeholder?: string,
    readOnly?: boolean,
    defaultValue?: string,
    onChange: (value: string) => void
}

interface State {
    hints: string[]
}

class AttributeInput extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            hints: []
        };
    }

    public componentDidMount() {
        this.laodHints();
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.attribute !== this.props.attribute) {
            this.laodHints();
        }
    }

    private async laodHints() {
        let db = await connectDb();
        if (isNil(this.props.attribute)) {
            let result = await db.collection<{ name: string }>('rules').aggregate([
                {
                    '$project': {
                        'name': {
                            '$reduce': {
                                'input': {
                                    '$objectToArray': '$conditions'
                                },
                                'initialValue': ['$answer.parameter'],
                                'in': {
                                    '$concatArrays': ['$$value', ['$$this.k']]
                                }
                            }
                        },
                        '_id': 0
                    }
                },
                { '$unwind': '$name' },
                { '$group': { '_id': { 'name': '$name' } } },
                { '$project': { 'name': '$_id.name', '_id': 0 } }
            ]).toArray();
            this.setState({ hints: result.map(h => h.name).sort() });
        } else if (this.props.attribute !== '') {
            let result = await db.collection<{ value: string }>('rules').aggregate([
                { '$match': { 'answer.parameter': this.props.attribute } },
                { '$project': { 'value': '$answer.value', '_id': 0 } },
                {
                    '$unionWith': {
                        'coll': 'rules',
                        'pipeline': [
                            { '$match': { [`conditions.${this.props.attribute}`]: { '$exists': true } } },
                            {
                                '$project': {
                                    'value': `$conditions.${this.props.attribute}`,
                                    '_id': 0
                                }
                            }
                        ]
                    }
                },
                { '$group': { '_id': { 'value': '$value' } } },
                { '$project': { 'value': '$_id.value', '_id': 0 } }
            ]).toArray();
            this.setState({ hints: result.map(h => h.value).sort() });
        }
    }

    public render(): JSX.Element {
        const { props, state } = this;
        return <HintInput hints={state.hints} className={props.className} readOnly={props.readOnly}
            defaultValue={props.defaultValue} placeholder={props.placeholder} onChange={props.onChange} />
    }
}

export default AttributeInput;