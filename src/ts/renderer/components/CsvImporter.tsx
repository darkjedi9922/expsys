import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as fs from '../electron/fs';
import { RootState } from '../store';
import { ImportEditor } from '../store/rules/types';
import { importFile } from '../store/rules/actions'; 
import { connect } from 'react-redux';
import EditorLayout from './EditorLayout';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import { isNil } from 'lodash';

interface OwnProps {
    id: string
}

interface StoreProps {
    editor: ImportEditor
}

const mapState = (state: RootState, props: OwnProps) => ({
    editor: state.rules.editors.find(e => e.id === props.id) as ImportEditor
})

const mapDispatch = { importFile }

const CsvImporter = function(props: OwnProps & StoreProps & typeof mapDispatch): JSX.Element {
    return <EditorLayout title="Импорт из CSV">
        {props.editor.isRuleAddedNotify && <Alert variant="success">Правила успешно добавлены</Alert>}
        <Row>
            <Col className="justify-content-md-end">
                <FormControl type="text" placeholder="Выберите CSV файл" 
                    defaultValue={props.editor.currentFile} readOnly={true} />
            </Col>
            <Col md="auto" className="px-0 mr-3">
                <Button variant="outline-secondary"
                    onClick={async () => props.importFile(props.id, await fs.open(['csv']))}
                >Выбрать</Button>
            </Col>
        </Row>
        {!isNil(props.editor.generatedRules) && <Row>
            <Col>
                <p className="my-2">Будут добавлены следующие правила:</p>
                {props.editor.generatedRules.length !== 0
                    ? props.editor.generatedRules.map((rule, index) => <div key={index}>
                        Если {Object.keys(rule.conditions).map((attr, index) => <span key={index}>
                            {index != 0 && ' и '}
                            <Badge variant="info">{attr}</Badge> = <Badge variant="info">{rule.conditions[attr]}</Badge>
                        </span>)}, то <>
                            <Badge variant="warning">{rule.answer.parameter}</Badge> = <Badge variant="warning">{rule.answer.value}</Badge>
                            <br/></>
                        </div>)
                    : 'Файл пуст'
                }
            </Col>
        </Row>}
    </EditorLayout>
}

export default connect<StoreProps, typeof mapDispatch>(mapState, mapDispatch)(CsvImporter);