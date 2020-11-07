import React from 'react';
import classNames from 'classnames';

interface Props {
  author: 'system' | 'user'
  direction: 'left' | 'right'
}

export default function DialogBubble(props: React.PropsWithChildren<Props>) {
  
  function getAuthorName() {
    switch (props.author) {
      case 'system': return 'Expsys';
      case 'user': return 'Пользователь';
    }
  }
  
  return (
    <div className={classNames(['dialog-bubble', {
      'dialog-bubble--left': props.direction === 'left',
      'dialog-bubble--right': props.direction === 'right'
    }])}>
      <div className="dialog-bubble__content">
        <span className={classNames(['dialog-bubble__author', {
          'dialog-bubble__author--left': props.direction === 'right',
          'dialog-bubble__author--right': props.direction === 'left',
        }])}>{getAuthorName()}</span>
        <div className="dialog-bubble__bubble">
          <div className={classNames(['dialog-bubble__arrow-border', {
            'dialog-bubble__arrow-border--left': props.direction === 'right',
            'dialog-bubble__arrow-border--right': props.direction === 'left'
          }])}></div>
          <div className={classNames(['dialog-bubble__arrow', {
            'dialog-bubble__arrow--left': props.direction === 'right',
            'dialog-bubble__arrow--right': props.direction === 'left'
          }])}></div>
          {props.children}
        </div>
      </div>
      <div className={classNames(['dialog-bubble__avatar', {
        'dialog-bubble__avatar--system': props.author === 'system',
        'dialog-bubble__avatar--user': props.author === 'user'
      }])}></div>
    </div>
  )
}