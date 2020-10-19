import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

interface Props {
    attribute: string,
    onAnswer: (answer?: string) => void
}

interface State {
    answer: string
}

class HintInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            answer: ''
        }
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return <Form onSubmit={(e) => {
            props.onAnswer(state.answer !== '' ? state.answer : null);
            e.preventDefault();
        }}>
            <Form.Row>
                <Col>
                    <Form.Text className="text-muted">
                        Введите значение атрибута {props.attribute} или оставьте поле пустым,
                        если не знаете ответ
                    </Form.Text>
                </Col>
            </Form.Row>
            <Form.Row>
                <Col>
                    <Form.Control type="text" name="value" placeholder={props.attribute}
                        onChange={e => this.setState({ answer: e.target.value })} />
                </Col>
                <Col md="auto">
                    <Button variant="primary" type="submit">Подтвердить</Button>
                </Col>
            </Form.Row>
        </Form>
    }
}

export default HintInput;