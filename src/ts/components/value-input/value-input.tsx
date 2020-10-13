import React from 'react';
import css from './value-input.css.json';

interface Props {
    label: string
}

const ValueInput = function(props: Props): JSX.Element {
    return <div className={css.root}>
        <span>{props.label}</span>
        <input type="text"/>
    </div>
};

export default ValueInput;