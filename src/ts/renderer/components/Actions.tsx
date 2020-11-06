import React from 'react';

export default function Actions(props: React.PropsWithChildren<{}>) {
    return <div className="actions">{React.Children.toArray(props.children).map((item, index) => (
        <div className="actions__item" key={index}>{item}</div>
    ))}</div>
}