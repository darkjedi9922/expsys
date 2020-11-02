import React from 'react';

interface Props {
  title: string,
  actions?: JSX.Element
}

export default function Card(props: React.PropsWithChildren<Props>) {
  return (
    <div className="my-card">
      <div className="my-card__header">
        <span className="my-card__title">{props.title}</span>
        <div className="my-card__actions">{props.actions}</div>
      </div>
      <div className="my-card__body">
        {props.children}
      </div>
    </div>
  )
}