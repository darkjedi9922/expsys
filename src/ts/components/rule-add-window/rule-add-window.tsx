import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RuleEditor from '../rule-editor/rule-editor';
import css from './rule-add-window.css.json';

class RuleAddWindow extends React.Component {

    public render(): React.ReactNode {
        return <div className={css.root}>
            <Container>
                <Row>
                    <Col>
                        <RuleEditor />
                    </Col>
                </Row>
            </Container>
        </div>
    }
}

export default RuleAddWindow;