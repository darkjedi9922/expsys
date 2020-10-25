import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import AttributeInput from '../attribute-input/attribute-input';
import Badge from 'react-bootstrap/Badge';

interface Props {
  attribute: string,
  onAnswer: (answer?: string) => void
}

interface State {
  answer: string
}

class DialogInput extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { answer: '' }
  }

  public render(): JSX.Element {
    let { props, state } = this;
    return <Navbar bg="light" expand="lg" className="px-0">
      <Col>
        <Form className="justify-content-md-end" onSubmit={(e) => {
          props.onAnswer(state.answer !== '' ? state.answer : null);
          e.preventDefault();
        }}>
          <Form.Row>
            <Col className="pr-0">
              <AttributeInput attribute={props.attribute} onChange={value => this.setState({ answer: value })} />
            </Col>
            <Col md="auto">
              <Button variant="primary" type="submit" className="ml-sm-2">Подтвердить</Button>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Text className="text-muted">
                Введите значение атрибута <Badge variant="info">{props.attribute}</Badge>{' '}
                или оставьте поле пустым, если не знаете ответ
              </Form.Text>
            </Col>
          </Form.Row>
        </Form>
      </Col>
    </Navbar>
  }
}

export default DialogInput;