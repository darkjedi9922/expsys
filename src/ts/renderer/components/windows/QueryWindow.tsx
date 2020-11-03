import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CenterWindow from './CenterWindow';
import { startQuery, answerHint } from '../../store/query/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import DialogInput from '../DialogInput';
import { isNil } from 'lodash';
import Alert from 'react-bootstrap/Alert';
import QueryForm from '../QueryForm';
import DialogHistory from '../DialogHistory';

export default function QueryWindow() {
  const aimAttribute = useSelector((state: RootState) => state.query.aimAttribute);
  const askingHintAttribute = useSelector((state: RootState) => state.query.askingHintAttribute);
  const answer = useSelector((state: RootState) => state.query.answer);
  const queringCompleted = useSelector((state: RootState) => state.query.queringCompleted);
  const dispatch = useDispatch();

  return <CenterWindow>
    <Container>
      <Row>
        <Col>
          <QueryForm onQuery={attribute => dispatch(startQuery(attribute))} />
        </Col>
      </Row>
      <DialogHistory/>
      <Row>
        <Col>
          {!isNil(askingHintAttribute) &&
            <DialogInput attribute={askingHintAttribute} onAnswer={(answer) => dispatch(answerHint(answer))} />}
          {queringCompleted && answer !== null &&
            <Alert variant="success">Ответ: {aimAttribute} — {answer}</Alert>}
          {queringCompleted && answer === null &&
            <Alert variant="danger">Ответ не найден</Alert>}
        </Col>
      </Row>
    </Container>
  </CenterWindow>
}