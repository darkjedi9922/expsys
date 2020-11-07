import React, { useEffect, useState } from 'react';
import { Attribute } from '../../../models/database';
import { connectDb } from '../../electron/db';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from '../Card';
import { ObjectId } from 'mongodb';
import Alert from 'react-bootstrap/Alert';
import Actions from '../Actions';
import { isEmpty } from 'lodash';

export default function AttributeListWindow() {
  const [attributes, setAttributes] = useState<Attribute[]>(null);
  const [deletedAttributeIds, setDeletedAttributeIds] = useState<ObjectId[]>([]);

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
          !deletedAttributeIds.find(id => id.equals(attr._id))
            ? <Card key={index} title={attr.name} actions={
                <Actions>
                  <Link to={`/attributes/item/${attr.name}`}>
                    <Button variant="outline-primary">Редактировать</Button>
                  </Link>
                  <Button variant="outline-danger" onClick={async () => {
                    let db = await connectDb();
                    db.collection<Attribute>('attributes').deleteOne({ _id: attr._id }, () => {
                      setDeletedAttributeIds([...deletedAttributeIds, attr._id]);
                    });
                  }}>Удалить</Button>
                </Actions>
              }>
              {attr.values.map((value, index) => (
                <p key={index}>Если {value.conditions.map((cond, index) => (
                  <span key={index}>
                    {cond.attribute} = {cond.value}{index !== value.conditions.length - 1 ? ' и ' : ''}
                  </span>
                ))}, то {attr.name} = {value.value}</p>
              ))}
              {!isEmpty(attr.defaultValue) && (
                <p>Иначе {attr.name} = {attr.defaultValue}</p>
              )}
            </Card>
            : <Alert key={index} variant="success">Атрибут успешно удален</Alert>
      ))}
    </div>
  )
}