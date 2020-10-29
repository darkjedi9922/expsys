import React from 'react';
import styles from './NoneValue.css.json';

interface Props {
    text?: string
}

export default function NoneValue(props: Props) {
    return <span className={styles.root}>{props.text || 'None'}</span>
}