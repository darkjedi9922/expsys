import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CenterWindow from './CenterWindow';
import DialogInput from '../DialogInput';
import { isNil } from 'lodash';
import Alert from 'react-bootstrap/Alert';
import QueryForm from '../QueryForm';
import DialogHistory from '../DialogHistory';
import resolve, { Resolver } from '../../../system/resolver-stright';
import {
  Message,
  MESSAGE_ANSWER,
  MESSAGE_ANSWER_DEFAULT,
  MESSAGE_ASK,
  MESSAGE_HINT,
  MESSAGE_RESOLVED
} from '../../../models/dialog';
import useStateCallback from '../../../common/useStateCallback';

export default function QueryWindow() {
  const [aimAttribute, setAimAttribute] = useState<string>(null);
  const [askingHintAttribute, setAskingHintAttribute] = useState<string>(null);
  const [answer, setAnswer] = useState<string>(null);
  const [queringCompleted, setQueringCompleted] = useState(false);
  const [resolver, setResolver] = useState<Resolver>(null);
  const [messages, setMessages] = useStateCallback<Message[]>([]);
  const [nextHandleMessage, setNextHandleMessage] = useState<Message>(null);

  useEffect(() => {
    if (nextHandleMessage !== null) {
      handleMessage(nextHandleMessage);
      setNextHandleMessage(null);
    }
  }, [nextHandleMessage]);

  async function startQuery(attribute: string) {
    setQueringCompleted(false);
    setAimAttribute(attribute);
    let resolver = resolve(attribute);
    setResolver(resolver);
    setMessages([], async () => {
      setNextHandleMessage((await resolver.next()).value);
    })
  }

  async function answerHint(value?: string) {
    setMessages([...messages, {
      type: MESSAGE_HINT,
      value: value
    }]);
    setAskingHintAttribute(null);
    setNextHandleMessage((await resolver.next(value)).value);
  }

  async function handleMessage(message: Message) {
    console.log('message', message);
    switch (message.type) {
      case MESSAGE_ANSWER:
      case MESSAGE_ANSWER_DEFAULT:
        setAnswer(message.value);
        setResolver(null);
        setQueringCompleted(true);
        break;
      case MESSAGE_ASK:
        setMessages([...messages, message]);
        setAskingHintAttribute(message.attribute);
        break;
      case MESSAGE_RESOLVED:
        setMessages([...messages, message])
        setNextHandleMessage((await resolver.next()).value);
        break;
    }
  } 

  return <CenterWindow>
    <Container>
      <Row>
        <Col>
          <QueryForm onQuery={startQuery} />
        </Col>
      </Row>
      <DialogHistory messages={messages} />
      <Row>
        <Col>
          {!isNil(askingHintAttribute) &&
            <DialogInput attribute={askingHintAttribute} onAnswer={answerHint} />}
          {queringCompleted && answer !== null &&
            <Alert variant="success">Ответ: {aimAttribute} — {answer}</Alert>}
          {queringCompleted && answer === null &&
            <Alert variant="danger">Ответ не найден</Alert>}
        </Col>
      </Row>
    </Container>
  </CenterWindow>
}