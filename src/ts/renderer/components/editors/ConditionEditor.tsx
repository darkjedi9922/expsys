import React, { useState } from 'react';
import { Condition } from '../../../models/database';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import classNames from 'classnames';
import RuleInput from '../RuleInput';
import { isConditionEmpty } from './_common';

interface Props {
  condition?: Condition
  isFirst: boolean,
  onChange: (condition: Condition) => void,
  onEmpty: () => void,
  onFill: () => void
}

export default function ConditionEditor(props: Props) {
  const [cond, setCond] = useState(props.condition || {
    attribute: '',
    value: ''
  });

  function updateCondition(newCondition: Condition) {
    if (!isConditionEmpty(cond) && isConditionEmpty(newCondition)) props.onEmpty();
    else if (isConditionEmpty(cond) && !isConditionEmpty(newCondition)) props.onFill();
    props.onChange(newCondition);
    setCond(newCondition);
  }

  return <Form.Group as={Row} className={classNames({
      'addition-rule-editor-row': !props.isFirst && isConditionEmpty(cond)
    })}>
    <RuleInput size={6} label={props.isFirst ? 'Если' : 'и'} defaultValue={cond.attribute}
      onChange={value => updateCondition({ attribute: value, value: cond.value })} />
    <RuleInput attribute={cond.attribute} size={6} label="=" defaultValue={cond.value}
      onChange={value => updateCondition({ attribute: cond.attribute, value: value })} />
  </Form.Group>
}