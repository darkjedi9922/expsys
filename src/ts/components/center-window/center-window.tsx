import React from 'react';
import css from './center-window.css.json';

const CenterWindow = function(props: React.PropsWithChildren<{}>): JSX.Element {
    return <div className={css.root}>{props.children}</div>
}

export default CenterWindow;