import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputEditor from './RuleEditor';
import CenterWindow from './CenterWindow';
import { RootState } from '../store';
import { EditorType } from '../store/rules/types';
import { useDispatch, useSelector } from 'react-redux';
import { addEditor, submitAddRule } from '../store/rules/actions';
import Button from 'react-bootstrap/Button';
import CsvImporter from './CsvImporter';
import classNames from 'classnames';

export default function RuleAddWindow() {
  const editors = useSelector((state: RootState) => state.rules.editors);
  const dispatch = useDispatch();

  return <CenterWindow>
    <Container>
      {editors.map(editor => 
        <Row key={editor.id}>
          <Col>
            {editor.type === EditorType.INPUT 
              ? <InputEditor id={editor.id} />
              : <CsvImporter id={editor.id} />}
          </Col>
        </Row>
      ).sort((a, b) => parseInt(a.key.toString()) - parseInt(b.key.toString()))}
      <Row className="justify-content-between">
        <Col className={classNames({ 'text-center': editors.length === 0 })}>
          <Button variant="primary" className="mr-sm-2" 
            onClick={() => dispatch(addEditor(EditorType.INPUT))}>Добавить правило</Button>
          <Button variant="primary"
            onClick={() => dispatch(addEditor(EditorType.IMPORTER))}>Импортировать из CSV</Button>
        </Col>
        {editors.length !== 0 && <Col md="auto">
          <Button variant="danger" onClick={() => editors.forEach(e => dispatch(submitAddRule(e.id)))}>Сохранить</Button>
        </Col>}
      </Row>
    </Container>
  </CenterWindow>
}