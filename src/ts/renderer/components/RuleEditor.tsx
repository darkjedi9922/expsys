import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import RuleInput from './RuleInput';
import { RootState } from '../store';
import { connect } from 'react-redux';
import { updateRule } from '../store/rules/actions';
import { Attribute, InputEditor, Rule } from '../store/rules/types';
import Alert from 'react-bootstrap/Alert';
import classNames from 'classnames';
import { generateRandomString } from '../../common/util';
import EditorLayout from './EditorLayout';

interface OwnProps {
    id: string
}

interface StoreProps {
    isAddedNotify: boolean
}

const mapState = (state: RootState, props: OwnProps): StoreProps => ({
    isAddedNotify: (state.rules.editors.find(e => e.id === props.id) as InputEditor).isRuleAddedNotify
})

const mapDispatch = { updateRule }

type Props = OwnProps & StoreProps & typeof mapDispatch;

interface Condition extends Attribute {
    inputId: string
}

interface State {
    conditions: Condition[],
    answer: Attribute
}

class RuleEditor extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            conditions: this.generateConditionsWithOneEmptyInput([]),
            answer: {
                parameter: '',
                value: ''
            }
        };
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return <EditorLayout title="Новое правило">
            <Form onSubmit={(e) => e.preventDefault()}>
                {props.isAddedNotify && <Alert variant="success">Правило успешно добавлено</Alert>}
                {state.conditions.map((cond, index) =>
                    <Form.Group as={Row} key={index} className={classNames({
                        'addition-rule-editor-row': index !== 0 && cond.parameter === '' && cond.value === ''
                    })}>
                        <RuleInput size={6} label={index === 0 ? 'Если' : 'и'}
                            onChange={(value) => this.setConditionParamter(value, index)} />
                        <RuleInput attribute={cond.parameter} size={6} label="="
                            onChange={(value) => this.setConditionValue(value, index)} />
                    </Form.Group>
                )}
                <Form.Group as={Row}>
                    <RuleInput size={6} label="то" onChange={(value) => this.setAnswerParameter(value)} />
                    <RuleInput size={6} label="=" attribute={state.answer.parameter}
                        onChange={(value) => this.setAnswerValue(value)} />
                </Form.Group>
            </Form>
        </EditorLayout> 
    }

    private assembleRule(): Rule {
        return {
            answer: this.state.answer,
            conditions: this.state.conditions.reduce((object, condition) => {
                if (condition.parameter === '' && condition.value === '') return object;
                object[condition.parameter] = condition.value;
                return object
            }, {})
        }
    }

    private setConditionParamter(name: string, index: number) {
        this.setState((state) => {
            let newState = { ...state };
            let oldCondition = state.conditions[index];
            if (oldCondition.value === '') {
                // Either parameter was empty or it became empty. Otherwise there
                // is no change and this method is not called
                if (oldCondition.parameter === '') {
                    newState.conditions.push({
                        inputId: generateRandomString(5),
                        parameter: '', value: ''
                    });
                } else if (name === '') {
                    newState.conditions.pop();
                }
            }
            newState.conditions[index].parameter = name;
            return newState;
        });
        this.props.updateRule(this.props.id, this.assembleRule());
    }

    private setConditionValue(value: string, index: number) {
        this.setState((state) => {
            let newState = { ...state };
            let oldCondition = state.conditions[index];
            if (oldCondition.parameter === '') {
                // Either value was empty or it became empty. Otherwise there
                // is no change and this method is not called
                if (oldCondition.value === '') {
                    newState.conditions.push({
                        inputId: generateRandomString(5),
                        parameter: '', value: ''
                    });
                } else if (value === '') {
                    newState.conditions.pop();
                }
            }
            newState.conditions[index].value = value;
            return newState;
        });
        this.props.updateRule(this.props.id, this.assembleRule());
    }

    private setAnswerParameter(name: string) {
        this.setState((state) => ({
            answer: {
                ...state.answer,
                parameter: name
            }
        }));
        this.props.updateRule(this.props.id, this.assembleRule());
    }

    private setAnswerValue(value: string) {
        this.setState((state) => ({
            answer: { ...state.answer, value }
        }));
        this.props.updateRule(this.props.id, this.assembleRule());
    }

    private generateConditionsWithOneEmptyInput(currentConditions: Condition[]): Condition[] {
        let result = currentConditions.filter(cond => cond.parameter !== '' || cond.value !== '');
        result.push({
            inputId: generateRandomString(5),
            parameter: '',
            value: ''
        });
        return result;
    }
}

export default connect<StoreProps, typeof mapDispatch>(mapState, mapDispatch)(RuleEditor);