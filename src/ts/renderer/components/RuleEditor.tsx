import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import RuleInput from './RuleInput';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { updateRule } from '../store/rules/actions';
import { Attribute, InputEditor, Rule } from '../store/rules/types';
import Alert from 'react-bootstrap/Alert';
import classNames from 'classnames';
import { getUniqueIndex } from '../../common/util';
import EditorLayout from './EditorLayout';
import { debounce } from 'lodash';

interface Props {
    id: number
}

interface Condition extends Attribute {
    inputId: number
}

export default function RuleEditor(props: Props) {
    const [conditions, setConditions] = useState<Condition[]>([{
        inputId: getUniqueIndex(),
        parameter: '',
        value: ''
    }]);
    const [answerParameter, setAnswerParameter] = useState('');
    const [answerValue, setAnswerValue] = useState('');
    const isAddedNotify = useSelector((state: RootState) => (state.rules.editors
        .find(e => e.id === props.id) as InputEditor).isRuleAddedNotify)
    const dispatch = useDispatch();

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
        dispatch(updateRule(props.id, assembleRule()));
    }

    function setConditionValue(value: string, inputId: number) {
        let newConditions = [...conditions];
        newConditions.find(cond => cond.inputId === inputId).value = value;
        setConditions(generateConditionsWithOneEmptyInput(newConditions, inputId));
        dispatch(updateRule(props.id, assembleRule()));
    }

    function generateConditionsWithOneEmptyInput(initConditions: Condition[], ignoreInputId: number): Condition[] {
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

    return <EditorLayout title="Новое правило">
        <Form onSubmit={(e) => e.preventDefault()}>
            {isAddedNotify && <Alert variant="success">Правило успешно добавлено</Alert>}
            {conditions.map((cond, index) =>
                <Form.Group as={Row} key={cond.inputId} className={classNames({
                    'addition-rule-editor-row': index !== 0 && cond.parameter === '' && cond.value === ''
                })}>
                    <RuleInput size={6} label={index === 0 ? 'Если' : 'и'}
                        onChange={value => debounce(() => setConditionParamter(value, cond.inputId), 100)()} />
                    <RuleInput attribute={cond.parameter} size={6} label="="
                        onChange={value => debounce(() => setConditionValue(value, cond.inputId), 100)()} />
                </Form.Group>
            )}
            <Form.Group as={Row}>
                <RuleInput size={6} label="то" onChange={value => debounce(() => {
                    setAnswerParameter(value);
                    dispatch(updateRule(props.id, assembleRule()));
                }, 100)()} />
                <RuleInput size={6} label="=" attribute={answerParameter}
                    onChange={value => debounce(() => {
                        setAnswerValue(value);
                        dispatch(updateRule(props.id, assembleRule()));
                    }, 100)()} />
            </Form.Group>
        </Form>
    </EditorLayout> 
}