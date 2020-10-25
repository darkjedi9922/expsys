import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import OnBlurComponent from '../OnBlurComponent';
import Card from 'react-bootstrap/Card';
import styles from './hint-input.css.json';
import $ from 'jquery';

interface Props {
    hints: string[],
    className?: string,
    placeholder?: string,
    onChange: (value: string) => void
}

interface State {
    selectedIndex?: number,
    blockHeight: string,
    showHints: boolean
}

class HintInput extends React.Component<Props, State> {

    private inputRef = React.createRef<HTMLInputElement>();
    private hintBlockRef = React.createRef<HTMLDivElement>();

    public constructor(props: Props) {
        super(props);
        this.state = {
            selectedIndex: null,
            blockHeight: '0',
            showHints: false
        };
    }

    public componentDidUpdate() {
        if (this.props.hints.length !== 0 && this.state.showHints && this.state.blockHeight === '0') {
            let body = $(this.hintBlockRef.current).find('.card-body').first();
            this.setState({
                blockHeight: `${Math.min(
                    body.outerHeight(),
                    $(document.body).height() - body.offset().top - 25
                )}px`
            })
        }
    }

    public render(): JSX.Element {
        const { props, state } = this;
        return <OnBlurComponent onBlur={() => this.hideHints()} className={styles.root}>
            <FormControl type="text" placeholder={props.placeholder}
                className={props.className} onChange={e => props.onChange(e.target.value)}
                onFocus={() => this.showHints()} onKeyDown={(e) => this.onKeyDown(e)}
                ref={this.inputRef} />
            {state.showHints && props.hints.length !== 0 && <Card className={`${styles.hintBlock} ${styles.card}`}
                style={{ 'height': state.blockHeight }} ref={this.hintBlockRef}>
                <Card.Body className={styles.cardBody}>
                    {props.hints.map((hint, index) =>
                        <Dropdown.Item key={hint} eventKey={hint} onClick={(e) => {
                            this.inputRef.current.value = hint;
                            this.hideHints();
                            props.onChange(hint);
                        }} active={state.selectedIndex === index}>{hint}</Dropdown.Item>
                    )}
                </Card.Body>
            </Card>}
        </OnBlurComponent>
    }

    private async showHints() {
        this.setState({
            selectedIndex: null,
            blockHeight: '0',
            showHints: true
        });
    }

    private hideHints() {
        this.setState({
            selectedIndex: null,
            blockHeight: '0',
            showHints: false
        });
    }

    private onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'ArrowDown') {
            if (this.state.selectedIndex === null) {
                this.setState({ selectedIndex: 0 })
            } else {
                this.setState((state, props) => ({
                    selectedIndex: state.selectedIndex + 1 < props.hints.length
                        ? state.selectedIndex + 1 : 0,
                }), () => {
                    this.correctHintBlockScroll();
                })
            }
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            if (this.state.selectedIndex === null) {
                this.setState((state, props) => ({ selectedIndex: props.hints.length - 1 }))
            } else {
                this.setState((state, props) => ({
                    selectedIndex: state.selectedIndex - 1 >= 0
                        ? state.selectedIndex - 1
                        : props.hints.length - 1,
                }), () => {
                    this.correctHintBlockScroll();
                })
            }
            e.preventDefault();
        }
    }

    private correctHintBlockScroll() {
        let hintBlock = $(this.hintBlockRef.current);
        let selectedItem = hintBlock.children().first()
            .find(`:contains("${this.props.hints[this.state.selectedIndex]}")`).first();
        let selectedItemTop = selectedItem.position().top;
        let selectedItemBottom = selectedItemTop + selectedItem.outerHeight();
        if (selectedItemBottom > hintBlock.height()) {
            hintBlock.scrollTop(hintBlock.scrollTop() + selectedItemBottom - hintBlock.height());
        } else if (selectedItemTop < 0) {
            hintBlock.scrollTop(hintBlock.scrollTop() + selectedItemTop);
        }
    }
}

export default HintInput;