import React from 'react';
import Card from 'react-bootstrap/Card';

interface Props {
    title: string
}

const EditorLayout = function(props: React.PropsWithChildren<Props>): JSX.Element {
    return <Card className="mb-sm-3">
        <Card.Header>{props.title}</Card.Header>
        <Card.Body>{props.children}</Card.Body>
    </Card>
}

export default EditorLayout;