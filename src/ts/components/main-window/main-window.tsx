import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import css from './main-window.css.json';
import QueryWindow from '../query-window/query-window';

const MainWindow = function(): JSX.Element {
    return <Container fluid={true} className={css.root}>
        <Row className={css.content}>
            <Col>
                <QueryWindow/>
            </Col>
        </Row>
    </Container>
}

export default MainWindow;