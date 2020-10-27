import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AttributeInput from './AttributeInput';

interface Props {
  onAsk: (attribute: string) => void
}

interface State {
  attribute: string
}

class AskForm extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = { attribute: '' }
  }

  public render(): JSX.Element {
    let { props, state } = this;
    return <Navbar bg="light" expand="lg">
      <Col md="auto" className="px-0"><Navbar.Brand>Что вы хотите узнать?</Navbar.Brand></Col>
      <Col className="px-0">
        <Form className="justify-content-md-end " onSubmit={(e) => {
          props.onAsk(state.attribute);
          e.preventDefault();
        }}>
          <Row>
            <Col className="pr-0">
              <AttributeInput onChange={(value) => this.setState({ attribute: value })} />
            </Col>
            <Col md="auto" className="pl-0">
              <Button variant="outline-success" type="submit" className="ml-sm-2">Вперед</Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Navbar>
  }
}

export default AskForm;