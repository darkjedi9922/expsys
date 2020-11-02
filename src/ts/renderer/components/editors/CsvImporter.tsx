import React, { useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as fs from '../../electron/fs';
import EditorLayout from './EditorLayout';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import { isNil } from 'lodash';
import { Rule } from '../../../models/database';

interface Props {
  isRuleAddedNotify: boolean,
  generatedRules?: Rule[],
  onSelect: (file: string | null) => void
}

export default function CsvImporter(props: Props) {
  const [file, setFile] = useState('');
  
  return <EditorLayout title="Импорт из CSV">
    {props.isRuleAddedNotify && <Alert variant="success">Правила успешно добавлены</Alert>}
    <Row>
      <Col className="justify-content-md-end">
        <FormControl type="text" placeholder="Выберите CSV файл" defaultValue={file} readOnly={true} />
      </Col>
      <Col md="auto" className="px-0 mr-3">
        <Button variant="outline-secondary"
          onClick={async () => {
            let file = await fs.open(['csv']);
            setFile(file);
            props.onSelect(file);
          }}
        >Выбрать</Button>
      </Col>
    </Row>
    {!isNil(props.generatedRules) && <Row>
      <Col>
        <p className="my-2">Будут добавлены следующие правила:</p>
        {props.generatedRules.length !== 0
          ? props.generatedRules.map((rule, index) => <div key={index}>
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