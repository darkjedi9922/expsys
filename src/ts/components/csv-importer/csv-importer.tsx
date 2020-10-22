import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as fs from '../../electron/renderer/fs';
import { RootState } from '../../store';
import { ImportEditor } from '../../store/rules/types';
import { importFile } from '../../store/rules/actions'; 
import { connect } from 'react-redux';
import EditorLayout from '../editor-layout/editor-layout';

interface OwnProps {
    id: string
}

interface StoreProps {
    file?: string
}

const mapState = (state: RootState, props: OwnProps) => ({
    file: (state.rules.editors.find(e => e.id === props.id) as ImportEditor).currentFile
})

const mapDispatch = { importFile }

const CsvImporter = function(props: OwnProps & StoreProps & typeof mapDispatch): JSX.Element {
    return <EditorLayout title="Импорт из CSV">
        <Row>
            <Col className="justify-content-md-end">
                <FormControl type="text" placeholder="Выберите CSV файл" readOnly={true} />
            </Col>
            <Col md="auto" className="px-0 mr-3">
                <Button variant="outline-secondary"
                    onClick={async () => props.importFile(props.id, await fs.open(['csv']))}
                >Выбрать</Button>
            </Col>
        </Row>
    </EditorLayout>
}

export default connect<StoreProps, typeof mapDispatch>(mapState, mapDispatch)(CsvImporter);