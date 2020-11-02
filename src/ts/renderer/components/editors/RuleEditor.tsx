import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import RuleInput from '../RuleInput';
import Alert from 'react-bootstrap/Alert';
import classNames from 'classnames';
import { getUniqueIndex } from '../../../common/util';
import EditorLayout from './EditorLayout';
import { debounce, isNil, map } from 'lodash';
import { ParamValue, Rule } from '../../../models/database';

interface Props {
    title?: string,
    firstInputLabel?: string,
    isAddedNotify?: boolean,
    errorNotify?: string,
    defaultRule?: Rule,
    lockedAnswerParameter?: string,
    onChange: (rule: Rule) => void
}

interface Condition extends ParamValue {
    inputId: number
}

export default function RuleEditor(props: Props) {
    const [conditions, setConditions] = useState<Condition[]>(props.defaultRule
        ? generateConditionsWithOneEmptyInput(map(props.defaultRule.conditions, (value, attribute) => ({
            inputId: getUniqueIndex(),
            parameter: attribute,
            value: value
        }))) : [{
            inputId: getUniqueIndex(),
            parameter: '',
            value: ''
        }]
    );
    const [answerParameter, setAnswerParameter] = useState(
        props.lockedAnswerParameter ? props.lockedAnswerParameter :
            props.defaultRule ? props.defaultRule.answer.parameter : '');
    const [answerValue, setAnswerValue] = useState(props.defaultRule ? props.defaultRule.answer.value : '');

    function assembleRule(): Rule {
        return {
            answer: {
                parameter: answerParameter,
                value: answerValue
            },
            conditions: conditions.reduce((object, condition) => {
                if (condition.parameter === '' && condition.value === '') return object;
                object[condition.parameter] = condition.value;
                return object
            }, {})
        }
    }

    function setConditionParamter(name: string, inputId: number) {
        let newConditions = [...conditions];
        newConditions.find(cond => cond.inputId === inputId).parameter = name;
        setConditions(generateConditionsWithOneEmptyInput(newConditions, inputId));
        props.onChange(assembleRule());
    }

    function setConditionValue(value: string, inputId: number) {
        let newConditions = [...conditions];
        newConditions.find(cond => cond.inputId === inputId).value = value;
        setConditions(generateConditionsWithOneEmptyInput(newConditions, inputId));
        props.onChange(assembleRule());
    }

    function generateConditionsWithOneEmptyInput(initConditions: Condition[], ignoreInputId: number = -1): Condition[] {
        let result = [...initConditions];
        let emptyIndexFound = -1;
        for (let i = 0; i < result.length; ++i) {
            if (result[i].parameter === '' && result[i].value === '') {
                if (emptyIndexFound == -1) {
                    emptyIndexFound = i;
                } else if (result[i].inputId !== ignoreInputId) {
                    result.splice(i, 1);
                    return result;
                } else {
                    result.splice(emptyIndexFound, 1);
                    return result;
                }
            }
        }
        if (emptyIndexFound == -1) {
            result.push({
                inputId: getUniqueIndex(),
                parameter: '',
                value: ''
            });
        }
        return result;
    }

    return <EditorLayout title={props.title || 'Новое правило'}>
        <Form onSubmit={(e) => e.preventDefault()}>
            {props.isAddedNotify && <Alert variant="success">Правило успешно добавлено</Alert>}
            {props.errorNotify && <Alert variant="danger">{props.errorNotify}</Alert>}
            {conditions.map((cond, index) =>
                <Form.Group as={Row} key={cond.inputId} className={classNames({
                    'addition-rule-editor-row': index !== 0 && cond.parameter === '' && cond.value === '',
                })}>
                    <RuleInput size={6} label={index === 0 ? 'Если' : 'и'} defaultValue={cond.parameter}
                        onChange={value => setConditionParamter(value, cond.inputId)} />
                    <RuleInput attribute={cond.parameter} size={6} label="=" defaultValue={cond.value}
                        onChange={value => setConditionValue(value, cond.inputId)} />
                </Form.Group>
            )}
            <Form.Group as={Row} className="mb-0">
                <RuleInput size={6} label="то" onChange={value => {
                        setAnswerParameter(value);
                        props.onChange(assembleRule());
                    }} readOnly={!isNil(props.lockedAnswerParameter)}
                    defaultValue={props.lockedAnswerParameter || props.defaultRule && props.defaultRule.answer.parameter} />
                <RuleInput size={6} label="=" attribute={props.lockedAnswerParameter || answerParameter}
                    onChange={value => {
                        setAnswerValue(value);
                        props.onChange(assembleRule());
                    }} defaultValue={props.defaultRule && props.defaultRule.answer.value}/>
            </Form.Group>
        </Form>
    </EditorLayout> 
}