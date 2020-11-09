import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import css from './MainWindow.css.json';
import QueryWindow from './QueryWindow';
import MenuIcon from '../MenuIcon';
import { Link, Route, Switch } from 'react-router-dom';
import AttributeEditWindow from './AttributeEditWindow';
import AttributeListWindow from './AttributeListWindow';
import classNames from 'classnames';

interface MenuIcon {
    link: string,
    title: string,
    fontelloIcon: string
}

const rightMenuValues: MenuIcon[] = [
    {
        link: '/attributes',
        title: 'Список атрибутов',
        fontelloIcon: 'list-bullet'
    },
    {
        link: '/attributes/add',
        title: 'Добавить атрибут',
        fontelloIcon: 'doc-new'
    }
]

const MainWindow = function(): JSX.Element {
    return <Container fluid={true} className={css.root}>
        <Row className={css.content}>
            <Col className="py-3">
                <Switch>
                    <Route path="/attributes/add" component={AttributeEditWindow} />
                    <Route path="/attributes/item/:attribute" component={AttributeEditWindow} />
                    <Route path="/attributes" component={AttributeListWindow} />
                    <Route path="/" component={QueryWindow} />
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
                    {rightMenuValues.map((item, index) => 
                        <Col key={index} className={classNames({ 'pr-0': index !== rightMenuValues.length - 1 })}>
                            <Link to={item.link}>
                                <MenuIcon title={item.title} fontelloIcon={item.fontelloIcon} buttonVariant="primary" />
                            </Link>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    </Container>
}

export default MainWindow;