import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CenterWindow from '../center-window/center-window';
import { startQuery, answerHint } from '../../store/query/actions';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import DialogInput from '../dialog-input/dialog-input';
import { isNil } from 'lodash';
import Alert from 'react-bootstrap/Alert';
import AskForm from '../ask-form/ask-form';

interface StoreProps {
  askingAttribute?: string,
  answer?: string,
  queringCompleted: boolean
}

const mapState = (state: RootState): StoreProps => ({
  askingAttribute: state.query.askingAttribute,
  answer: state.query.answer,
  queringCompleted: state.query.queringCompleted
})

const actions = { startQuery, answerHint };

type Props = StoreProps & typeof actions;

interface State {}

class QueryWindow extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {}
  }

  public render(): JSX.Element {
    let { props, state } = this;
    return <CenterWindow>
      <Container>
        <Row>
          <Col>
            <AskForm onAsk={attribute => props.startQuery(attribute)} />
          </Col>
        </Row>
        <Row>
          <Col>
            {!isNil(props.askingAttribute) &&
              <DialogInput attribute={props.askingAttribute} onAnswer={(answer) => props.answerHint(answer)} />}
            {props.queringCompleted && props.answer !== null &&
              <Alert variant="success">Ответ: {props.answer}</Alert>}
            {props.queringCompleted && props.answer === null &&
              <Alert variant="danger">Ответ не найден</Alert>}
          </Col>
        </Row>
      </Container>
    </CenterWindow>
  }
}

export default connect<StoreProps, typeof actions>(mapState, actions)(QueryWindow);