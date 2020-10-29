import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Attribute } from '../../../models/database';
import { connectDb } from '../../electron/db';
import NoneValue from '../NoneValue';
import CenterWindow from './CenterWindow';
import Card from 'react-bootstrap/Card';
import TableAction from '../TableAction';
import { Link } from 'react-router-dom';

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

  return <CenterWindow>
    <Card>
      <Card.Header>Список атрибутов</Card.Header>
      <Card.Body>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Атрибут</th>
              <th>Правил</th>
              <th>По-умолчанию</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attributes && attributes.map((attr, index) => <tr key={index}>
              <th>{index}</th>
              <td>{attr.name}</td>
              <td>{attr.values.length}</td>
              <td>{attr.defaultValue || <NoneValue/>}</td>
              <td>
                <Link to="/attributes/item/:attribute">
                  <TableAction tooltip="Редактировать" fontelloIcon="pencil" color="blue" />
                </Link>
              </td>
            </tr>)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </CenterWindow> 
}