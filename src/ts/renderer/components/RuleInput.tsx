import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import AttributeInput from './AttributeInput';

interface Props {
    label: string,
    size: number,
    attribute?: string,
    readOnly?: boolean,
    defaultValue?: string,
    onChange?: (value: string) => void
}

const RuleInput = function(props: Props): JSX.Element {
    return <>
        <Form.Label column sm="1">{props.label}</Form.Label>
        <Col sm={props.size - 1}>
            <AttributeInput attribute={props.attribute} readOnly={props.readOnly}
                defaultValue={props.defaultValue} onChange={(value) => props.onChange(value)} />
        </Col>
    </>
};

export default RuleInput;