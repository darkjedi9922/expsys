import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputEditor from './RuleEditor';
import CenterWindow from './CenterWindow';
import { RootState } from '../store';
import { Editor, EditorType } from '../store/rules/types';
import { connect } from 'react-redux';
import { addEditor, submitAddRule } from '../store/rules/actions';
import Button from 'react-bootstrap/Button';
import CsvImporter from './CsvImporter';
import classNames from 'classnames';

interface StoreProps {
    editors: Editor[]
}

const mapState = (state: RootState): StoreProps => ({
    editors: state.rules.editors
})

const mapDispatch = { addEditor, submitAddRule }

const RuleAddWindow = function(props: StoreProps & typeof mapDispatch): JSX.Element {
    return <CenterWindow>
        <Container>
            {props.editors.map(editor => 
                <Row key={editor.id}>
                    <Col>
                        {editor.type === EditorType.INPUT 
                            ? <InputEditor id={editor.id} />
                            : <CsvImporter id={editor.id} />}
                    </Col>
                </Row>
            )}
            <Row className="justify-content-between">
                <Col className={classNames({ 'text-center': props.editors.length === 0 })}>
                    <Button variant="primary" className="mr-sm-2" 
                        onClick={() => props.addEditor(EditorType.INPUT)}>Добавить правило</Button>
                    <Button variant="primary"
                        onClick={() => props.addEditor(EditorType.IMPORTER)}>Импортировать из CSV</Button>
                </Col>
                {props.editors.length !== 0 && <Col md="auto">
                    <Button variant="danger" onClick={() => {
                        props.editors.forEach(e => props.submitAddRule(e.id))
                    }}>Сохранить</Button>
                </Col>}
            </Row>
        </Container>
    </CenterWindow>
}

export default connect<StoreProps, typeof mapDispatch>(mapState, mapDispatch)(RuleAddWindow);