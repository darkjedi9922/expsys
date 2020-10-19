import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import RuleInput from '../rule-input/rule-input';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import { addRule } from '../../store/rules/actions';
import { Rule } from '../../store/rules/types';
import Alert from 'react-bootstrap/Alert';
import classNames from 'classnames';
import css from './rule-editor.css.json';
import { generateRandomString } from '../../util';

interface OwnProps {
    id: string
}

interface StoreProps {
    isAdded: boolean
}

const mapState = (state: RootState, ownProps: OwnProps): StoreProps => ({
    isAdded: state.rules.addRuleEditorIds.includes(ownProps.id)
})

const mapDispatch = { addRule }

type Props = OwnProps & StoreProps & typeof mapDispatch;

interface Pair {
    parameter: string,
    value: string
}

interface Condition extends Pair {
    inputId: string
}

interface State {
    conditions: Condition[],
    answer: Pair,
    isSubmitted: boolean
}

class RuleEditor extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);
        this.state = {
            conditions: this.generateConditionsWithOneEmptyInput([]),
            answer: {
                parameter: '',
                value: ''
            },
            isSubmitted: false
        };
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return <Form onSubmit={(e) => {
            props.addRule(props.id, this.assembleRule());
            this.setState({ isSubmitted: true });
            e.preventDefault();
        }}>
            {state.isSubmitted && props.isAdded && <Alert variant="success">Правило успешно добавлено</Alert>}
            {state.conditions.map((cond, index) => 
                <Form.Group as={Row} key={index} className={classNames({
                    [css.additionRow]: index !== 0 && cond.parameter === '' && cond.value === ''
                })}>
                    <RuleInput size={6} label={index === 0 ? 'Если' : 'и'} 
                        placeholder="параметр" onChange={(value) => this.setConditionParamter(value, index)} />
                    <RuleInput size={6} label="="
                        placeholder="значение" onChange={(value) => this.setConditionValue(value, index)} />
                </Form.Group>
            )}
            <Form.Group as={Row}>
                <RuleInput size={6} label="то" placeholder="параметр" onChange={(value) => this.setAnswerParameter(value)} />
                <RuleInput size={6} label="=" placeholder="значение" onChange={(value) => this.setAnswerValue(value)} />
            </Form.Group>
            <Button variant="primary" type="submit">Добавить</Button>
        </Form>
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
            newState.isSubmitted = false;
            return newState;
        });
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
            newState.isSubmitted = false;
            return newState;
        });
    }

    private setAnswerParameter(name: string) {
        this.setState((state) => ({
            answer: {
                ...state.answer,
                parameter: name
            },
            isSubmitted: false
        }));
    }

    private setAnswerValue(value: string) {
        this.setState((state) => ({
            answer: { ...state.answer, value },
            isSubmitted: false
        }));
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