import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AttributeInput from './AttributeInput';

interface Props {
  onQuery: (attribute: string) => void
}

export default function QueryForm(props: Props) {
  let [attribute, setAttribute] = useState('');

  return <Navbar bg="light" expand="lg">
    <Col md="auto" className="px-0"><Navbar.Brand>Что вы хотите узнать?</Navbar.Brand></Col>
    <Col className="px-0">
      <Form className="justify-content-md-end " onSubmit={(e) => {
        props.onQuery(attribute);
        e.preventDefault();
      }}>
        <Row>
          <Col className="pr-0">
            <AttributeInput onChange={value => setAttribute(value)} onlyResolvable={true} />
          </Col>
          <Col md="auto" className="pl-0">
            <Button variant="outline-success" type="submit" className="ml-sm-2">Вперед</Button>
          </Col>
        </Row>
      </Form>
    </Col>
  </Navbar>
}