import React, { useEffect, useRef, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import OnBlurComponent from './OnBlurComponent';
import Card from 'react-bootstrap/Card';
import styles from './HintInput.css.json';
import $ from 'jquery';

interface Props {
  hints: string[],
  className?: string,
  placeholder?: string,
  readOnly?: boolean,
  defaultValue?: string,
  onChange: (value: string) => void,
  onShowHints?: () => void,
  onHideHints?: () => void
}

export default function HintInput(props: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [blockHeight, setBlockHeight] = useState('0');
  const [doShowHints, setShowHints] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintBlockRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (props.hints.length !== 0 && doShowHints && blockHeight === '0') {
      let body = $(hintBlockRef.current).find('.card-body').first();
      setBlockHeight(`${Math.min(
        body.outerHeight(),
        $(document.body).height() - body.offset().top - 25
      )}px`);
    }
  })

  useEffect(() => {
    if (selectedIndex != null) correctHintBlockScroll();
  }, [selectedIndex])

  async function showHints() {
    props.onShowHints && props.onShowHints();
    setSelectedIndex(null);
    setBlockHeight('0');
    setShowHints(true);
  }

  function hideHints() {
    props.onHideHints && props.onHideHints();
    setShowHints(false);
    setSelectedIndex(null);
    setBlockHeight('0');
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      if (selectedIndex === null) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(selectedIndex + 1 < props.hints.length ? selectedIndex + 1 : 0);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (selectedIndex === null) {
        setSelectedIndex(props.hints.length - 1);
      } else {
        setSelectedIndex(selectedIndex - 1 >= 0 ? selectedIndex - 1 : props.hints.length - 1);
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      hideHints();
    }
  }

  function correctHintBlockScroll() {
    let hintBlock = $(hintBlockRef.current);
    let selectedItem = hintBlock.children().first()
      .find(`:contains("${props.hints[selectedIndex]}")`).first();
    let selectedItemTop = selectedItem.position().top;
    let selectedItemBottom = selectedItemTop + selectedItem.outerHeight();
    if (selectedItemBottom > hintBlock.height()) {
      hintBlock.scrollTop(hintBlock.scrollTop() + selectedItemBottom - hintBlock.height());
    } else if (selectedItemTop < 0) {
      hintBlock.scrollTop(hintBlock.scrollTop() + selectedItemTop);
    }
  }

  return <OnBlurComponent onBlur={() => hideHints()} className={styles.root}>
    <FormControl type="text" placeholder={props.placeholder}
      className={props.className} onChange={e => props.onChange(e.target.value)}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => props.onChange(e.target.value)}
      onFocus={() => !props.readOnly && showHints()} onKeyDown={(e) => onKeyDown(e)}
      ref={inputRef} readOnly={props.readOnly} defaultValue={props.defaultValue} />
    {doShowHints && props.hints.length !== 0 && (
      <Card className={`${styles.hintBlock} ${styles.card}`}
        style={{ 'height': blockHeight }} ref={hintBlockRef}>
        <Card.Body className={styles.cardBody}>
          {props.hints.map((hint, index) =>
            <Dropdown.Item key={hint} eventKey={hint} onClick={(e) => {
              inputRef.current.value = hint;
              hideHints();
              props.onChange(hint);
            }} active={selectedIndex === index}>{hint}</Dropdown.Item>
          )}
        </Card.Body>
      </Card>
    )}
  </OnBlurComponent>
}