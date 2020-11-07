import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import RuleInput from '../RuleInput';
import Alert from 'react-bootstrap/Alert';
import { getUniqueIndex } from '../../../common/util';
import { isEmpty, omit } from 'lodash';
import { AttributeValue, Condition } from '../../../models/database';
import ConditionEditor from './ConditionEditor';
import { isConditionEmpty } from './_common';
import Col from 'react-bootstrap/Col';
import classNames from 'classnames';
import Card from '../Card';
import Actions from '../Actions';
import Button from 'react-bootstrap/Button';

interface Props {
  title: string,
  errorNotify?: string,
  attribute?: string,
  value?: AttributeValue
  onChange: (value: AttributeValue) => void,
  onRemove?: () => void,
  onCopy?: () => void
}

interface Value extends AttributeValue {
  conditions: IdCondition[]
}

export interface IdCondition extends Condition {
  id: number
}

export default function AttributeEditor(props: Props) {
  const [value, setValue] = useState(adjustValue(props.value));

  function adjustValue(value?: AttributeValue): Value {
    return {
      value: value && value.value || '',
      conditions: adjustConditions(value && value.conditions || [])
    }
  }

  function adjustConditions(conditions: Condition[]): IdCondition[] {
    let result = conditions.map(condition => ({
      ...condition,
      id: getUniqueIndex()
    }));
    result.push(createEmptyCondition())
    return result;
  }

  function createEmptyCondition(): IdCondition {
    return {
      id: getUniqueIndex(),
      attribute: '',
      value: ''
    };
  }

  useEffect(() => {
    console.log('Effect value updated')
    notifyValueUpdated(value);
  }, [value]);

  function notifyValueUpdated(value: Value) {
    let realConditions = value.conditions.map(c => omit(c, ['id']));
    for (let i = 1; i < realConditions.length; ++i) {
      if (isConditionEmpty(realConditions[i])) {
        realConditions.splice(i, 1);
        break;
      }
    }
    props.onChange({
      ...value,
      conditions: realConditions
    });
  }

  return <Card title={props.title} actions={(
    <Actions>
      {props.onCopy && <Button variant="outline-primary" onClick={() => props.onCopy()}>Скопировать</Button>}
      {props.onRemove && <Button variant="outline-danger" onClick={() => props.onRemove()}>Убрать</Button>}
    </Actions>
  )}>
    <Form onSubmit={(e) => e.preventDefault()}>
      {props.errorNotify && <Alert variant="danger">{props.errorNotify}</Alert>}
      {value.conditions.map((cond, index) =>
        <ConditionEditor key={cond.id} condition={cond} isFirst={index === 0}
          onChange={(newCond: IdCondition) => {
            setValue(prevValue => {
              let newValue = { ...prevValue };
              let oldCondIndex = prevValue.conditions.findIndex(c => c.id === cond.id);
              newValue.conditions.splice(oldCondIndex, 1, {
                ...newCond,
                id: cond.id
              });
              return newValue;
            })
          }} onEmpty={() => {
            setValue((prevValue) => {
              let newValue = { ...prevValue };
              let emptyCondIndex = prevValue.conditions.findIndex(c => isConditionEmpty(c) && c.id !== cond.id);
              newValue.conditions.splice(emptyCondIndex, 1);
              return newValue;
            })
          }} 
          onFill={() => {
            setValue(prevValue => {
              let newValue = { ...prevValue };
              newValue.conditions.push(createEmptyCondition());
              return newValue;
            });
          }} />
      )}
      <Form.Group as={Row} className="mb-0">
        <Col md="1">то</Col>
        <Col md="5">
          <span className={classNames({
            'attribute-editor__attribute--none': isEmpty(props.attribute)
          })}>{!isEmpty(props.attribute) ? props.attribute : 'атрибут'}</span>
        </Col>
        <RuleInput size={6} label="=" attribute={props.attribute} onChange={v => {
            let newValue = {...value};
            newValue.value = v;
            setValue(newValue);
          }} defaultValue={value.value}/>
      </Form.Group>
    </Form>
  </Card>
}