import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import css from './MainWindow.css.json';
import QueryWindow from './QueryWindow';
import MenuIcon from '../MenuIcon';
import RuleAddWindow from './RuleAddWindow';
import { Link, Route, Switch } from 'react-router-dom';
import AttributeEditWindow from './AttributeEditWindow';

const MainWindow = function(): JSX.Element {
    return <Container fluid={true} className={css.root}>
        <Row className={css.content}>
            <Col className="py-3">
                <Switch>
                    <Route exact path="/" component={QueryWindow} />
                    <Route path="/rules/add" component={RuleAddWindow} />
                    <Route path="/attributes/add" component={AttributeEditWindow} />
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
                <Row>
                    <Col className="pr-0">
                        <Link to="/attributes/add">
                            <MenuIcon title="Добавить атрибут" fontelloIcon="tags" buttonVariant="primary" />
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/rules/add">
                            <MenuIcon title="Добавить правило" fontelloIcon="doc-new" buttonVariant="primary" />
                        </Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
}

export default MainWindow;