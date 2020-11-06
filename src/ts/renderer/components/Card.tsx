import React from 'react';

interface Props {
  title: string,
  actions?: JSX.Element
}

export default function Card(props: React.PropsWithChildren<Props>) {
  return (
    <div className="card2">
      <div className="card2__header">
        <span className="card2__title">{props.title}</span>
        <div className="card2__actions">{props.actions}</div>
      </div>
      <div className="card2__body">
        {props.children}
      </div>
    </div>
  )
}