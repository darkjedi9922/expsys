import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

interface Props {
    label: string,
    placeholder: string,
    size: number,
    onChange?: (value: string) => void
}

const RuleInput = function(props: Props): JSX.Element {
    return <>
        <Form.Label column sm="1">{props.label}</Form.Label>
        <Col sm={props.size - 1}>
            <Form.Control placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} />
        </Col>
    </>
};

export default RuleInput;