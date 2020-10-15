import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RuleEditor from '../rule-editor/rule-editor';
import { generateRandomString } from '../../util';
import CenterWindow from '../center-window/center-window';

class RuleAddWindow extends React.Component {

    public render(): React.ReactNode {
        return <CenterWindow>
            <Container>
                <Row>
                    <Col>
                        <RuleEditor id={generateRandomString(6)} />
                    </Col>
                </Row>
            </Container>
        </CenterWindow>
    }
}

export default RuleAddWindow;