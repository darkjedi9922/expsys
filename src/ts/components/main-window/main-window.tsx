import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import css from './main-window.css.json';
import QueryWindow from '../query-window/query-window';
import MenuIcon from '../menu-icon/menu-icon';
import RuleAddWindow from '../rule-add-window/rule-add-window';
import { Link, Route, Switch } from 'react-router-dom';

const MainWindow = function(): JSX.Element {
    return <Container fluid={true} className={css.root}>
        <Row className={css.content}>
            <Col>
                <Switch>
                    <Route exact path="/" component={QueryWindow} />
                    <Route path="/rules/add" component={RuleAddWindow} />
                </Switch>
            </Col>
        </Row>
        <Row className="mb-md-3 justify-content-between">
            <Col>
                <Link to="/">
                    <MenuIcon title="Новый опрос" fontelloIcon="chat-empty" buttonVariant="success" />
                </Link>
            </Col>
            <Col md="auto">
                <Link to="/rules/add">
                    <MenuIcon title="Добавить правило" fontelloIcon="doc-new" buttonVariant="primary" />
                </Link>
            </Col>
        </Row>
    </Container>
}

export default MainWindow;