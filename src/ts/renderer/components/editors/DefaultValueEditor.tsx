import React from 'react';
import Card from '../Card';
import Alert from 'react-bootstrap/Alert';
import classNames from 'classnames';
import AttributeInput from '../AttributeInput';
import Actions from '../Actions';
import Button from 'react-bootstrap/Button';

interface Props {
    error?: string,
    attribute: string,
    defaultValue?: string,
    onChange: (value: string) => void,
    onRemove: () => void
}

export default function DefaultValueEditor(props: Props) {
    return <Card title="Иначе" actions={(
        <Actions>
            <Button variant="outline-danger" onClick={() => props.onRemove()}>Убрать</Button>
        </Actions>
    )}>
        <div className="default-value-editor">
            {props.error && <Alert variant="danger">{props.error}</Alert>}
            <div className="default-value-editor__input-row">
                <span className={classNames(['default-value-editor__attribute', {
                    'default-value-editor__attribute--empty': props.attribute === ''
                }])}>{props.attribute !== '' ? props.attribute : 'По-умолчанию'}</span>
                <AttributeInput attribute={props.attribute} defaultValue={props.defaultValue} 
                    onChange={props.onChange} className="default-value-editor__input" />
            </div>
        </div>
    </Card>
}