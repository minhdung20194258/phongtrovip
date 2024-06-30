import {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import AppInput from '@/components/Input/AppInput.jsx';
import {IconCheck, IconChevron} from '@/components/Icons/AppIcon.jsx';
import clsx from 'clsx';
import './AppCombobox.scss';
import useOnClickOutside from '@/hooks/useOnClickOutSide.jsx';
import PropTypes from 'prop-types';

function AppCombobox({
  selected = '',
  onSelected = (_, __, ___) => {},
  errorMess = '',
  options = [],
  isReference = false,
  size = 'md',

  ...props
}) {
  const currentSelected = useMemo(
    () => options.find((item) => item.value === selected) || {},
    [options, selected],
  );
  const [showOptions, setShowOptions] = useState(false);
  const comboboxRef = useRef(null);
  const optionsRef = useRef([]);

  useOnClickOutside({ref: comboboxRef, handler: () => setShowOptions(false)});

  const toggleShowOptions = (event) => {
    event.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  const scrollIntoOptions = useCallback(() => {
    const activeItem = optionsRef.current[currentSelected?.value];
    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [currentSelected]);

  useEffect(() => {
    if (showOptions) scrollIntoOptions();
  }, [scrollIntoOptions, showOptions]);

  return (
    <div
      className={clsx({
        'App-Combobox': true,
        'input--error': errorMess,
        lg: size === 'lg',
        sm: size === 'sm',
        [props.className]: props.className,
      })}
      onClick={() => setShowOptions(true)}
      ref={comboboxRef}
    >
      {/*{selected?.prefix && <div className={'w-20'}>{selected.prefix}</div>}*/}
      <AppInput
        label={props.label}
        title={props.title}
        disabled={props.disabled}
        required={props.required}
        value={currentSelected?.label || ''}
        onClick={toggleShowOptions}
        errorMess={errorMess}
        iconFocusInput={false}
        icon={(props) => {
          return IconChevron({
            type: showOptions ? 'up' : 'down',
            onClick: toggleShowOptions,
            ...props,
          });
        }}
        prefix={currentSelected?.prefix}
        size={size}
        placeholder={props.placeholder}
        className="App-Combobox__SelectOptions"
        classNameInput={clsx({
          [props.classNameInput]: props.classNameInput,
        })}
      />

      <div className="combobox-content" style={{display: !showOptions ? 'none' : 'block'}}>
        <ul>
          {isReference && <li className="item--placeholder">-Select option-</li>}
          {options.map((option, index) => (
            <li
              key={index}
              className={clsx({
                'item--checked': selected === option.value,
              })}
              onClick={(event) => {
                event.stopPropagation();
                onSelected(option?.value, option?.label, option);
                setShowOptions(false);
              }}
              ref={(el) => (optionsRef.current[option.value] = el)}
            >
              <div className="h-20 d-flex max-line-1-1">
                {option?.prefix}
                <span className={'pl-4'}>{option.labelOption || option.label}</span>
              </div>
              {selected === option.value && IconCheck()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

AppCombobox.propTypes = {
  label: PropTypes.any,
  title: PropTypes.string,
  required: PropTypes.bool,
  errorMess: PropTypes.string,
  selected: PropTypes.any,
  size: PropTypes.oneOf(['sm', 'lg']),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.any.isRequired,
      labelOption: PropTypes.any,
      prefix: PropTypes.any,
    }),
  ),
  onSelected: PropTypes.func,
  isReference: PropTypes.bool,

  disabled: PropTypes.bool,
  className: PropTypes.string,
  classNameInput: PropTypes.string,

  name: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  autoComplete: PropTypes.oneOf(['on', 'off']),
  autoFocus: PropTypes.bool,
  pattern: PropTypes.instanceOf(RegExp),
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  checked: PropTypes.bool,
  form: PropTypes.string,
  tabindex: PropTypes.number,
  autocapitalize: PropTypes.string,
  autocorrect: PropTypes.string,
};

export default AppCombobox;
