import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CenterWindow from '../center-window/center-window';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { startQuery, answerHint } from '../../store/query/actions';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import HintInput from '../hint-input/hint-input';
import { isNil } from 'lodash';
import Alert from 'react-bootstrap/Alert';
import AttributeInput from '../attribute-input/attribute-input';

interface StoreProps {
    askingAttribute?: string,
    answer?: string,
    queringCompleted: boolean
}

const mapState = (state: RootState): StoreProps => ({
    askingAttribute: state.query.askingAttribute,
    answer: state.query.answer,
    queringCompleted: state.query.queringCompleted
})

const actions = { startQuery, answerHint };

type Props = StoreProps & typeof actions;

interface State {
    attribute: string
}

class QueryWindow extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            attribute: ''
        }
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return <CenterWindow>
            <Container>
                <Row>
                    <Col>
                        <Navbar bg="light" expand="lg">
                            <Navbar.Brand>Что вы хотите узнать?</Navbar.Brand>
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Form inline className="col-12 justify-content-md-end" onSubmit={(e) => {
                                    props.startQuery(state.attribute);
                                    e.preventDefault();
                                }}>
                                    <AttributeInput type="name" onChange={(value) => this.setState({ attribute: value })} />
                                    <Button variant="outline-success" type="submit" className="ml-sm-2">Вперед</Button>
                                </Form>
                            </Navbar.Collapse>
                        </Navbar>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {!isNil(props.askingAttribute) &&
                            <HintInput attribute={props.askingAttribute} onAnswer={(answer) => props.answerHint(answer)} />}
                        {props.queringCompleted && props.answer !== null &&
                            <Alert variant="success">Ответ: {props.answer}</Alert>}
                        {props.queringCompleted && props.answer === null &&
                            <Alert variant="danger">Ответ не найден</Alert>}
                    </Col>
                </Row>
            </Container>
        </CenterWindow>
    }
}

export default connect<StoreProps, typeof actions>(mapState, actions)(QueryWindow);