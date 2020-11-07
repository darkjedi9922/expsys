import React, { useEffect, useRef, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import OnBlurComponent from './OnBlurComponent';
import Card from 'react-bootstrap/Card';
import styles from './HintInput.css.json';
import $ from 'jquery';
import classNames from 'classnames';

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
  const [searchValue, setSearchValue] = useState(props.defaultValue || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const hintBlockRef = useRef<HTMLDivElement>();

  const filteredHints = props.hints.filter(hint => hint.search(new RegExp(searchValue, 'i')) !== -1);

  useEffect(() => {
    if (filteredHints.length !== 0 && doShowHints) {
      let body = $(hintBlockRef.current).find('.card-body').first();
      setBlockHeight(`${Math.min(
        body.outerHeight(),
        $(document.body).height() - body.offset().top - 25
      )}px`);
    }
  }, [props.hints.length, doShowHints, searchValue])

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
        setSelectedIndex(selectedIndex + 1 < filteredHints.length ? selectedIndex + 1 : 0);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (selectedIndex === null) {
        setSelectedIndex(filteredHints.length - 1);
      } else {
        setSelectedIndex(selectedIndex - 1 >= 0 ? selectedIndex - 1 : filteredHints.length - 1);
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      hideHints();
    } else if (e.key === 'Enter' && selectedIndex !== null) {
      hideHints();
      inputRef.current.value = filteredHints[selectedIndex];
      props.onChange(filteredHints[selectedIndex]);
      e.preventDefault();
    }
  }

  function correctHintBlockScroll() {
    if (filteredHints.length !== 0) {
      let hintBlock = $(hintBlockRef.current);
      let selectedItem = hintBlock.children().first()
        .find(`:contains("${filteredHints[selectedIndex]}")`).first();
      let selectedItemTop = selectedItem.position().top;
      let selectedItemBottom = selectedItemTop + selectedItem.outerHeight();
      if (selectedItemBottom > hintBlock.height()) {
        hintBlock.scrollTop(hintBlock.scrollTop() + selectedItemBottom - hintBlock.height());
      } else if (selectedItemTop < 0) {
        hintBlock.scrollTop(hintBlock.scrollTop() + selectedItemTop);
      }
    }
  }

  function handleValueChange(value: string) {
    setSelectedIndex(null);
    setSearchValue(value);
    props.onChange(value);
  }

  return <OnBlurComponent onBlur={() => hideHints()} className={classNames([styles.root, props.className])}>
    <FormControl type="text" placeholder={props.placeholder}
      onChange={e => handleValueChange(e.target.value)}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleValueChange(e.target.value)}
      onFocus={() => !props.readOnly && showHints()} onKeyDown={(e) => onKeyDown(e)}
      ref={inputRef} readOnly={props.readOnly} defaultValue={props.defaultValue} />
    {doShowHints && filteredHints.length !== 0 && (
      <Card className={`${styles.hintBlock} ${styles.card}`}
        style={{ 'height': blockHeight }} ref={hintBlockRef}>
        <Card.Body className={styles.cardBody}>
          {filteredHints.map((hint, index) =>
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