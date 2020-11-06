import React from 'react';
import Card from '../Card';

interface Props {
    title: string
}

const EditorLayout = function(props: React.PropsWithChildren<Props>): JSX.Element {
    return <Card title={props.title}>{props.children}</Card>
}

export default EditorLayout;