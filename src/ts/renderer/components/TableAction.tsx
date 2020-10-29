import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from './TableAction.css.json';
import classNames from 'classnames';

interface Props {
    tooltip: string,
    fontelloIcon: string,
    color: 'yellow' | 'blue'
}

export default function TableAction(props: Props) {
    return <OverlayTrigger placement="right" overlay={
        <Tooltip id={`tooltip-top`}>{props.tooltip}</Tooltip>}>
        <span className={classNames(styles.action, styles[props.color])}>
            <i className={`icon-${props.fontelloIcon}`}></i>
        </span>
    </OverlayTrigger>
}