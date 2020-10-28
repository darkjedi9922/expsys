import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Message, MESSAGE_ANSWER, MESSAGE_ASK, MESSAGE_HINT } from '../../models/dialog';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { generateRandomString } from '../../common/util';
import styles from './DialogHistory.css.json';

export default function DialogHistory() {
  const messages = useSelector((state: RootState) => state.query.messages);

  function isSystemMessage(message: Message) {
    return [MESSAGE_ASK, MESSAGE_ANSWER].includes(message.type);
  }

  function generateMessageText(message: Message) {
    switch (message.type) {
      case MESSAGE_ASK:
        return `${message.attribute}?`
      case MESSAGE_HINT:
        return message.value
    }
  }

  return <>{messages.filter(message => message.type !== MESSAGE_ANSWER).map((message) =>
      <Row key={generateRandomString(4)} className={`justify-content-${isSystemMessage(message) ? 'end' : 'start'}`}>
        <Col md="auto">
          <OverlayTrigger trigger={null} defaultShow={true} overlay={
            <Popover id={null}>
              <Popover.Content>
                <span className={styles.text}>{generateMessageText(message)}</span>
              </Popover.Content>
            </Popover>
          } placement={message.type === MESSAGE_HINT ? 'right' : 'left'}>
            <div style={{ height: '4rem' }}></div>
          </OverlayTrigger>
        </Col>
      </Row>
  )}</>
}