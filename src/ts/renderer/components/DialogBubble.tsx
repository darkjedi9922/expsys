import React from 'react';
import classNames from 'classnames';

interface Props {
    direction: 'left' | 'right'
}

export default function DialogBubble(props: React.PropsWithChildren<Props>) {
    return <div className="dialog-bubble">
        <div className={classNames(['dialog-bubble__arrow-border', {
            'dialog-bubble__arrow-border--left': props.direction === 'right',
            'dialog-bubble__arrow-border--right': props.direction === 'left'
        }])}></div>
        <div className={classNames(['dialog-bubble__arrow', {
            'dialog-bubble__arrow--left': props.direction === 'right',
            'dialog-bubble__arrow--right': props.direction === 'left'
        }])}></div>
        {props.children}
    </div>
}