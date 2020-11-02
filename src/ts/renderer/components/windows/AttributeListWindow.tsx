import React, { useEffect, useState } from 'react';
import { Attribute } from '../../../models/database';
import { connectDb } from '../../electron/db';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from '../Card';

export default function AttributeListWindow() {
  const [attributes, setAttributes] = useState<Attribute[]>(null);

  useEffect(() => {
    if (attributes === null) {
      (async () => {
        let db = await connectDb();
        let attributes = await db.collection<Attribute>('attributes').find().toArray();
        setAttributes(attributes);
      })()
    }
  })

  return (
    <div className="attribute-list-window">
      {attributes && attributes.map((attr, index) => (
          <Card key={index} title={attr.name} actions={(
            <Link to={`/attributes/item/${attr.name}`}>
              <Button variant="secondary">Редактировать</Button>
            </Link>
          )}>
            {attr.values.map((value, index) => (
              <p key={index}>Если {value.conditions.map((cond, index) => (
                <span key={index}>
                  {cond.attribute} = {cond.value}{index !== value.conditions.length - 1 ? ' и ' : ''}
                </span>
              ))}, то {attr.name} = {value.value}</p>
            ))}
          </Card>
      ))}
    </div>
  )
}