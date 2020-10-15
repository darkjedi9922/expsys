import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import css from './menu-icon.css.json';

interface Props {
    title: string,
    fontelloIcon: string,
    buttonVariant: string
}

const MenuIcon = function(props: Props): JSX.Element {
    return <OverlayTrigger placement="top" overlay={
        <Tooltip id={`tooltip-top`}>{props.title}</Tooltip>}>
        <Button variant={props.buttonVariant} size="lg" className={css.button}>
            <i className={`icon-${props.fontelloIcon}`}></i>
        </Button>
    </OverlayTrigger>
}

export default MenuIcon;