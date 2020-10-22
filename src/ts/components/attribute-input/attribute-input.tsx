import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import { connectDb } from '../../electron/renderer/db';
import OnBlurComponent from '../OnBlurComponent';
import Card from 'react-bootstrap/Card';
import styles from './attribute-input.css.json';

interface Props {
    type: 'name' | 'value',
    className?: string,
    onChange: (value: string) => void
}

interface State {
    hints: {
        list: string[],
        selectedIndex?: number
    }
}

class AttributeInput extends React.Component<Props, State> {

    private inputRef = React.createRef<HTMLInputElement>();

    public constructor(props: Props) {
        super(props);
        this.state = {
            hints: {
                list: [],
                selectedIndex: null
            }
        };
    }

    public render(): JSX.Element {
        const { props, state } = this;
        return <OnBlurComponent onBlur={() => this.hideHints()} className={styles.root}>
            <FormControl type="text" placeholder={props.type === 'name' ? 'Параметр' : 'Значение'}
                className={props.className} onChange={e => props.onChange(e.target.value)}
                onFocus={() => this.updateHints()} onKeyDown={(e) => this.onKeyDown(e)}
                ref={this.inputRef} />
                <Card className={`${styles.hintBlock} ${styles.card}`}>
                    <Card.Body className={styles.cardBody}>
                        {state.hints.list.map((hint, index) => 
                            <Dropdown.Item key={hint} eventKey={hint} onClick={(e) => {
                                this.inputRef.current.value = hint;
                                this.hideHints();
                                props.onChange(hint);
                            }} active={state.hints.selectedIndex === index}>{hint}</Dropdown.Item>
                        )}
                    </Card.Body>
                </Card>
        </OnBlurComponent>
    }

    private async updateHints() {
        let db = await connectDb();
        if (this.props.type === 'name') {
            let hints = await db.collection<{ name: string }>('rules').aggregate([
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
            this.setState({
                hints: {
                    list: hints.map(h => h.name).sort(),
                    selectedIndex: null
                }
            });
        }
    }

    private hideHints() {
        this.setState({
            hints: {
                list: [],
                selectedIndex: null
            }
        });
    }

    private onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'ArrowDown') {
            if (this.state.hints.selectedIndex === null) {
                this.setState((state) => ({
                    hints: {
                        list: state.hints.list,
                        selectedIndex: 0
                    }
                }))
            } else {
                this.setState((state) => ({
                    hints: {
                        list: state.hints.list,
                        selectedIndex: state.hints.selectedIndex + 1 < state.hints.list.length
                            ? state.hints.selectedIndex + 1 : 0
                    }
                }))
            }
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            if (this.state.hints.selectedIndex === null) {
                this.setState((state) => ({
                    hints: {
                        list: state.hints.list,
                        selectedIndex: state.hints.list.length - 1,
                    }
                }))
            } else {
                this.setState((state) => ({
                    hints: {
                        list: state.hints.list,
                        selectedIndex: state.hints.selectedIndex - 1 >= 0
                            ? state.hints.selectedIndex - 1
                            : state.hints.list.length - 1
                    }
                }))
            }
            e.preventDefault();
        }
    }
}

export default AttributeInput;