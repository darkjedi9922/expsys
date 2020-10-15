import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import RuleInput from '../rule-input/rule-input';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import { addRule } from '../../store/rules/actions';
import { Rule } from '../../store/rules/types';
import { range } from 'lodash';
import Alert from 'react-bootstrap/Alert';

interface OwnProps {
    id: string
}

interface StateProps {
    isAdded: boolean
}

interface DispatchProps {
    addRule: (editorId: string, rule: Rule) => void
}

type Props = OwnProps & StateProps & DispatchProps;

const mapState = (state: RootState, ownProps: OwnProps): StateProps => ({
    isAdded: state.rules.addRuleEditorIds.includes(ownProps.id)
})

const mapDispatch: DispatchProps = {
    addRule
}

const RuleEditor = function(props: Props): JSX.Element {
    
    let conditions: Array<typeof rule.answer> = range(1).map(() => ({
        parameter: undefined,
        value: undefined
    }));
    let rule: Rule = {
        conditions: {},
        answer: {
            parameter: undefined,
            value: undefined
        }
    };

    let assembleRule = (): Rule => ({
        answer: rule.answer,
        conditions: conditions.reduce((object, condition) => {
            object[condition.parameter] = condition.value;
            return object
        }, {})
    })

    return <Form onSubmit={(e) => {
        props.addRule(props.id, assembleRule());
        e.preventDefault();
    }}>
        {props.isAdded && <Alert variant="success">Правило успешно добавлено</Alert>}
        {conditions.map((condition, index) => 
            <Form.Group as={Row} key={index}>
                <RuleInput size={6} label="Если" placeholder="параметр" onChange={(value) => condition.parameter = value} />
                <RuleInput size={6} label="=" placeholder="значение" onChange={(value) => condition.value = value} />
            </Form.Group>
        )}
        <Form.Group as={Row}>
            <RuleInput size={6} label="то" placeholder="параметр" onChange={(value) => rule.answer.parameter = value} />
            <RuleInput size={6} label="=" placeholder="значение" onChange={(value) => rule.answer.value = value} />
        </Form.Group>
        <Button variant="primary" type="submit">Добавить</Button>
    </Form>
}

export default connect<StateProps, DispatchProps, OwnProps>(mapState, mapDispatch)(RuleEditor);