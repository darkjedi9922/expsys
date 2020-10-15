import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CenterWindow from '../center-window/center-window';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const QueryWindow = function(): JSX.Element {
    return <CenterWindow>
        <Container>
            <Row>
                <Col>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand>Что вы хотите узнать?</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Form inline className="col-12 justify-content-md-end">
                                <FormControl type="text" placeholder="Параметр" className="mr-sm-2 col-5" />
                                <Button variant="outline-success" type="submit">Вперед</Button>
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    </CenterWindow>
}

export default QueryWindow;