import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CenterWindow from './CenterWindow';
import { Attribute, AttributeValue, Rule } from '../../../models/database';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { getUniqueIndex } from '../../../common/util';
import RuleEditor from '../RuleEditor';
import EditorLayout from '../EditorLayout';
import RuleInput from '../RuleInput';
import Alert from 'react-bootstrap/Alert';
import { map } from 'lodash';
import { connectDb } from '../../electron/db';
import { useParams } from 'react-router-dom';
import AttributeInput from '../AttributeInput';

interface Editor {
  id: number,
  rule: Rule,
  errorNotify?: string
}

export default function AttributeEditWindow() {
  const { attribute: attributeQuery } = useParams<{attribute: string}>(); 
  const [loaded, setLoaded] = useState(false);
  const [attribute, setAttribute] = useState<Attribute>({
    name: '',
    values: [{
      value: '',
      conditions: [{
        attribute: '',
        value: ''
      }]
    }],
    defaultValue: null
  });
  const [editors, setEditors] = useState<Editor[]>([createNewEditor()]);
  const [attributeNameError, setAttributeNameError] = useState<string>(null);
  const [showElseEditor, setShowElseEditor] = useState(false);
  const [elseEditorError, setElseEditorError] = useState<string>(null);
  const [processing, setProcessing] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [addedNotify, setAddedNotify] = useState(false);

  useEffect(() => {
    if (!loaded) {
      (async () => {
        if (attributeQuery) {
          let db = await connectDb();
          setAttribute(await db.collection<Attribute>('attributes').findOne({
            name: attributeQuery
          }))
          setEditors(attribute.values.map(value => createNewEditor(value)))
        }
        setLoaded(true);
      })()
    }
  });

  function createNewEditor(value?: AttributeValue): Editor {
    return {
      id: getUniqueIndex(),
      rule: {
        answer: {
          parameter: attribute.name,
          value: value && value.value || '',
        },
        conditions: value && value.conditions.reduce((object, condition) => {
          object[condition.attribute] = condition.value;
          return object;
        }, {}) || []
      },
      errorNotify: null
    }
  }

  function checkErrors(): boolean {
    let fail = false;
    if (!attribute) {
      fail = true;
      setAttributeNameError('Поле не заполнено');
    }
    let newEditors = [...editors];
    editors.forEach(editor => {
      if (!isRuleFilled(editor.rule)) {
        fail = true;
        newEditors.find(e => e.id === editor.id).errorNotify = 'Не все обязательные поля заполнены';
      }
    })
    setEditors(newEditors);
    if (showElseEditor && !attribute.defaultValue) {
      fail = true;
      setElseEditorError('Поле не заполнено');
    }
    setHasErrors(fail);
    return !fail;
  }

  function isRuleFilled(rule: Rule): boolean {
    if (!rule.answer.parameter || !rule.answer.value) return false;
    for (const condName in rule.conditions) {
        const condValue = rule.conditions[condName];
        if (!condName || !condValue) return false;
    }
    return true;
  }

  async function insertAttributeToDb(attribute: Attribute) {
    let db = await connectDb();
    await db.collection<Attribute>('attributes').insertOne(attribute);
  }

  async function updateAttributeInDb(attribute: Attribute) {
    let db = await connectDb();
    await db.collection<Attribute>('attributes').updateOne({
      _id: attribute._id
    }, {
      $set: {
        name: attribute.name,
        values: attribute.values,
        defaultValue: attribute.defaultValue
      }
    });
  }

  function resetSubmitState() {
    let newEditors = [...editors];
    newEditors.forEach(editor => editor.errorNotify = null);
    setEditors(newEditors);
    setAttributeNameError(null);
    setElseEditorError(null);
    setHasErrors(false);
    setAddedNotify(false);
  }

  return <CenterWindow>
    <Container>
      {attributeNameError && <Alert variant="danger">{attributeNameError}</Alert>}
      <Form.Group as={Row}>
        <Form.Label column md={1} className="text-center pr-0">Атрибут</Form.Label>
        <Col><AttributeInput defaultValue={attribute.name} onChange={value => {
          let newAttribute = {...attribute};
          newAttribute.name = value;
          setAttribute(newAttribute);
          setEditors(editors.map(editor => {
            let newEditor = {...editor};
            newEditor.rule.answer.parameter = value;
            return newEditor;
          }));
          resetSubmitState();
        }} /></Col>
      </Form.Group>
      {editors.sort((a, b) => a.id - b.id).map((editor, index) =>
        <RuleEditor key={editor.id} title={index === 0 ? 'Если' : 'Иначе, если'}
          firstInputLabel="Параметр" defaultRule={editor.rule} errorNotify={editor.errorNotify}
          lockedAnswerParameter={attribute.name} onChange={rule => {
            let newEditors = [...editors];
            let newEditor = newEditors.find(e => e.id === editor.id);
            newEditor.rule = rule;
            newEditor.rule.answer.parameter = attribute.name;
            setEditors(newEditors);
            resetSubmitState();
          }}
        />
      )}
      {showElseEditor &&
        <EditorLayout title="Иначе">
          {elseEditorError && <Alert variant="danger">{elseEditorError}</Alert>}
          <Row>
            <Col md={6}>
              <FormControl readOnly={true} defaultValue={attribute.name} />
            </Col>
            <RuleInput label="=" size={6} attribute={attribute.name} defaultValue={attribute.defaultValue || ''}
              onChange={value => {
                let newAttribute = {...attribute};
                newAttribute.defaultValue = value;
                setAttribute(newAttribute);
                resetSubmitState();
              }} />
          </Row>
        </EditorLayout>
      }
      {addedNotify && <Alert variant="success">Атрибут успешно сохранен</Alert>}
      {hasErrors && <Alert variant="danger">Редактор содержит ошибки. Исправьте их перед продолжением</Alert>}
      <Row className="justify-content-between">
        <Col>
          <Button variant="primary" className="mr-sm-2" 
            onClick={() => setEditors([...editors, createNewEditor()])}>Добавить условие</Button>
          {!showElseEditor && <Button variant="primary" className="mr-sm-2"
            onClick={() => {
              setElseEditorError(null);
              setShowElseEditor(true);
            }}>Добавить значение по умолчанию</Button>}
        </Col>
        <Col md="auto">
          <Button variant="danger" disabled={processing} onClick={async () => {
            setProcessing(true);
            if (checkErrors()) {
              if (!attributeQuery) await insertAttributeToDb(attribute);
              else await updateAttributeInDb(attribute);
              setAddedNotify(true);
            }
            setProcessing(false);
          }}>Сохранить</Button>
        </Col>
      </Row>
    </Container>
  </CenterWindow>
}