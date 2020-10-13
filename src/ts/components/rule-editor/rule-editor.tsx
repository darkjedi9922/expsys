import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import RuleInput from '../rule-input/rule-input';

const RuleEditor = function(): JSX.Element {
    return <Form>
        <Form.Group as={Row}>
            <RuleInput size={6} label="Если" placeholder="параметр" />
            <RuleInput size={6} label="=" placeholder="значение" />
        </Form.Group>
        <Form.Group as={Row}>
            <RuleInput size={6} label="то" placeholder="параметр" />
            <RuleInput size={6} label="=" placeholder="значение" />
        </Form.Group>
        <Button variant="primary" type="submit">Добавить правило</Button>
    </Form>
}

export default RuleEditor;