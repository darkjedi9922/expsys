import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Message, MESSAGE_ANSWER, MESSAGE_ANSWER_DEFAULT, MESSAGE_ASK, MESSAGE_HINT, MESSAGE_RESOLVED } from '../../models/dialog';
import styles from './DialogHistory.css.json';
import DialogBubble from './DialogBubble';
import { isEmpty } from 'lodash';

interface Props {
  messages: Message[]
}

export default function DialogHistory(props: Props) {

  function isSystemMessage(message: Message) {
    return [
      MESSAGE_ASK,
      MESSAGE_ANSWER,
      MESSAGE_ANSWER_DEFAULT,
      MESSAGE_RESOLVED
    ].includes(message.type);
  }

  function generateMessageText(message: Message) {
    switch (message.type) {
      case MESSAGE_ASK:
        return `${message.attribute}?`;
      case MESSAGE_HINT:
        return !isEmpty(message.value) ? message.value : 'Это слишком сложно для меня';
      case MESSAGE_RESOLVED:
        return `Известно, что ${message.value.conditions.map(cond => `${cond.attribute} — ${cond.value}`).join(', ')}. `
          + `Исходя из этого вывод: ${message.attribute} — ${message.value.value}`;
    }
  }

  return <>{props.messages.map((message, index) =>
      <Row key={index} className={`justify-content-${isSystemMessage(message) ? 'end' : 'start'}`}>
        <Col md="auto">
          <DialogBubble direction={isSystemMessage(message) ? 'left' : 'right'}
            author={isSystemMessage(message) ? 'system' : 'user'}>
            <span className={styles.text}>{generateMessageText(message)}</span>
          </DialogBubble>
        </Col>
      </Row>
  )}</>
}