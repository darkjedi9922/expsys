import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CenterWindow from './CenterWindow';
import { Attribute, AttributeValue, Rule } from '../../../models/database';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getUniqueIndex } from '../../../common/util';
import Alert from 'react-bootstrap/Alert';
import { connectDb } from '../../electron/db';
import { useParams } from 'react-router-dom';
import AttributeInput from '../AttributeInput';
import AttributeEditor from '../editors/AttributeEditor';
import { isConditionEmpty } from '../editors/_common';
import { ObjectId } from 'mongodb';
import { isEmpty, isNil, map, trim } from 'lodash';
import Actions from '../Actions';
import DefaultValueEditor from '../editors/DefaultValueEditor';
import CsvImporter from '../editors/CsvImporter';
import paparse from 'papaparse';
import * as fs from '../../electron/fs';
import generateProductionRules from '../../../system/inductor';
import { adjustTable } from '../../../system/transpiler';

const VALUE_EDITOR = 'VALUE_EDITOR';
const CSV_IMPORTER = 'CSV_IMPORTER';

interface AbstractEditor {
  id: number,
  errorNotify?: string
}

interface ValueEditor extends AbstractEditor {
  type: typeof VALUE_EDITOR,
  value: AttributeValue,
}

interface ImportEditor extends AbstractEditor {
  type: typeof CSV_IMPORTER,
  generatedRules?: Rule[],
}

type Editor = ValueEditor | ImportEditor;

export default function AttributeEditWindow() {
  const { attribute: attributeQuery } = useParams<{attribute: string}>();
  const [loaded, setLoaded] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [attributeId, setAttributeId] = useState<ObjectId>(null);
  const [attributeName, setAttributeName] = useState('');
  const [attributeDefaultValue, setAttributeDefaultValue] = useState<string>(null);
  const [editors, setEditors] = useState<Editor[]>([]);
  const [attributeNameError, setAttributeNameError] = useState<string>(null);
  const [showElseEditor, setShowElseEditor] = useState(false);
  const [elseEditorError, setElseEditorError] = useState<string>(null);
  const [processing, setProcessing] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [savedNotify, setSavedNotify] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setAttributeName(attributeQuery);
      (async () => {
        if (attributeQuery) {
          let db = await connectDb();
          let attribute = await db.collection<Attribute>('attributes').findOne({
            name: attributeQuery
          });
          setAttributeId(attribute._id);
          if (attribute.defaultValue) {
            setShowElseEditor(true);
            setAttributeDefaultValue(attribute.defaultValue);
          }
          setEditors(attribute.values.map(value => createValueEditor(value)))
        }
        setLoaded(true);
      })()
    }
  });

  function createValueEditor(value?: AttributeValue): ValueEditor {
    return {
      id: getUniqueIndex(),
      type: VALUE_EDITOR,
      value: value || createEmptyValue(),
      errorNotify: null
    }
  }

  function createCsvImporter(): ImportEditor {
    return {
      id: getUniqueIndex(),
      type: CSV_IMPORTER,
      generatedRules: null
    }
  }

  function createEmptyValue(): AttributeValue {
    return {
      value: '',
      conditions: []
    };
  }

  function checkErrors(): boolean {
    let fail = false;
    if (!attributeName) {
      fail = true;
      setAttributeNameError('Поле не заполнено');
    }
    let newEditors = [...editors];
    newEditors.forEach(editor => {
      switch (editor.type) {
        case VALUE_EDITOR:
          if (!isValueFilled(editor.value)) {
            fail = true;
            editor.errorNotify = 'Не все обязательные поля заполнены';
          }
          break;
        case CSV_IMPORTER:
          if (editor.generatedRules && editor.generatedRules.length
            && editor.generatedRules[0].answer.parameter !== attributeName) {
              fail = true;
              editor.errorNotify = 'Правила не соответствуют атрибуту'
            }
          break;
      }
    })
    setEditors(newEditors);
    if (showElseEditor && !attributeDefaultValue) {
      fail = true;
      setElseEditorError('Поле не заполнено');
    }
    setHasErrors(fail);
    return !fail;
  }

  function isValueFilled(value: AttributeValue): boolean {
    if (!value.value) return false;
    for (let i = 0; i < value.conditions.length; ++i) {
      if (isConditionEmpty(value.conditions[i])) return false;
    }
    return true;
  }

  async function insertAttributeToDb(attribute: Attribute) {
    let db = await connectDb();
    db.collection<Attribute>('attributes').insertOne(attribute, (err, res) => {
        setAttributeId(res.insertedId);
    });
  }

  async function updateAttributeInDb(attribute: Attribute) {
    let db = await connectDb();
    await db.collection<Attribute>('attributes').updateOne({ _id: attributeId }, {
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
    setSavedNotify(false);
  }

  function assembleAttribute(): Attribute {
    let values: AttributeValue[] = [];
    editors.forEach(editor => {
      switch (editor.type) {
        case VALUE_EDITOR:
          values.push(editor.value);
          break;
        case CSV_IMPORTER:
          values = values.concat(editor.generatedRules.map(rule => ({
            value: rule.answer.value,
            conditions: map(rule.conditions, (value, key) => ({
              attribute: key,
              value: value
            }))
          })));
          break;
      }
    })
    return {
      name: attributeName,
      values: values,
      defaultValue: attributeDefaultValue
    }
  }

  function removeEditor(editor: Editor) {
    setEditors(editors.filter(e => e.id !== editor.id));
  }

  function copyEditor(editor: Editor) {
    let newEditor = { ...editor, id: editor.id + 0.000001 };
    setEditors([...editors, newEditor]);
  }

  async function importFile(importerId: number, file?: string) {
    let csvData = !isNil(file) ? paparse.parse<string[]>(await fs.readFile(file)).data : null;
    setEditors(editors.map(editor => {
      if (editor.id === importerId) {
        let importer = (editor as ImportEditor);
        importer.generatedRules = !isNil(file)
          ? generateProductionRules(
            csvData[0].map(item => trim(item)),
            adjustTable(csvData.slice(1)), 0).map(rule => ({
              conditions: rule[2],
              answer: {
                parameter: rule[0],
                value: rule[1]
              }
            })
          ) : null;
      }
      return editor;
    }))
  }

  return <CenterWindow>
    {!deleted ? <Container>
      {attributeNameError && <Alert variant="danger">{attributeNameError}</Alert>}
      <Form.Group as={Row}>
        <Form.Label column md={1} className="text-center pr-0">Атрибут</Form.Label>
        <Col><AttributeInput defaultValue={attributeName} onChange={value => {
          setAttributeName(value);
          setEditors(editors.map(editor => {
            let newEditor = {...editor};
            if (newEditor.type === VALUE_EDITOR) {
              newEditor.value.value = value;
            }
            return newEditor;
          }));
          resetSubmitState();
        }} /></Col>
      </Form.Group>
      {editors.sort((a, b) => a.id - b.id).map((editor, index) => editor.type === VALUE_EDITOR
        ? <AttributeEditor key={editor.id} title={index === 0 ? 'Если' : 'Иначе, если'}
          errorNotify={editor.errorNotify} attribute={attributeName} value={editor.value}
          onChange={newValue => {
            console.log('Value change handler', JSON.stringify(newValue))
            let newEditors = [...editors];
            let newEditor = newEditors.find(e => e.id === editor.id);
            (newEditor as ValueEditor).value = newValue;
            setEditors(newEditors);
            resetSubmitState();
          }} onRemove={() => removeEditor(editor)} onCopy={() => copyEditor(editor)} />
        : <CsvImporter key={editor.id} onSelect={(file) => importFile(editor.id, file)}
            onRemove={() => removeEditor(editor)} onCopy={() => copyEditor(editor)}
            generatedRules={editor.generatedRules} errorNotify={editor.errorNotify} />
      )}
      {showElseEditor && <DefaultValueEditor error={elseEditorError} attribute={attributeName}
        defaultValue={attributeDefaultValue || ''} onChange={value => {
          setAttributeDefaultValue(value);
          resetSubmitState();
        }} onRemove={() => {
          setAttributeDefaultValue(null);
          setShowElseEditor(false);
          resetSubmitState();
        }} />
      }
      {savedNotify && <Alert variant="success">Атрибут успешно сохранен</Alert>}
      {hasErrors && <Alert variant="danger">Редактор содержит ошибки. Исправьте их перед продолжением</Alert>}
      <Row className="justify-content-between">
        <Col>
          <Button variant="primary" className="mr-sm-2" 
            onClick={() => setEditors([...editors, createValueEditor()])}>
            Добавить условие
          </Button>
          <Button variant="primary" className="mr-sm-2"
            onClick={() => setEditors([...editors, createCsvImporter()])}>
            Импортировать из CSV
          </Button>
          {!showElseEditor && <Button variant="primary" className="mr-sm-2"
            onClick={() => {
              setElseEditorError(null);
              setShowElseEditor(true);
            }}>Добавить значение по умолчанию</Button>}
        </Col>
        <Col md="auto">
          <Actions>
            <Button variant="success" disabled={processing} onClick={async () => {
              setProcessing(true);
              if (checkErrors()) {
                if (!attributeId) await insertAttributeToDb(assembleAttribute());
                else await updateAttributeInDb(assembleAttribute());
                setSavedNotify(true);
              }
              setProcessing(false);
            }}>Сохранить</Button>
            {attributeId && <Button variant="danger" disabled={processing} onClick={async () => {
              setProcessing(true);
              let db = await connectDb();
              db.collection<Attribute>('attributes').deleteOne({ _id: attributeId }, () => {
                setDeleted(true);
                setProcessing(false);
              })
            }}>Удалить</Button>}
          </Actions>
        </Col>
      </Row>
    </Container>
    : <Alert variant="success">Атрибут{!isEmpty(attributeName) ? ` ${attributeName}` : ''} успешно удален</Alert>}
  </CenterWindow>
}