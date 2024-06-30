import {useRef, useState} from 'react';
import {IconEye, IconEyeSlash} from '../Icons/AppIcon';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import './AppInput.scss';
import AppLoading from '@/components/Loading/AppLoading.jsx';

AppInput.propTypes = {
  icon: PropTypes.func,
  errorMess: PropTypes.string,
  onChange: PropTypes.func,
  onChecked: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'lg', 'md']),
  loading: PropTypes.bool,
  iconFocusInput: PropTypes.bool,
  inputEnd: PropTypes.bool,
  labelHidden: PropTypes.bool,
  labelEnd: PropTypes.bool,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  helpText: PropTypes.any,
  textarea: PropTypes.bool,

  id: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.any,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  classNameInput: PropTypes.string,
  type: PropTypes.oneOf([
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week',
    'phone',
  ]),
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onSubmit: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyPress: PropTypes.func,
  onScroll: PropTypes.func,
  onResize: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
};

function AppInput({
  icon,
  errorMess,
  value,
  onChange,
  onChecked,
  size,
  loading = false,
  iconFocusInput = true,
  labelHidden = false,
  labelEnd = false,
  inputEnd = false,
  prefix,
  suffix,
  className,
  classNameInput,
  textarea = false,
  helpText = '',

  ...props
}) {
  const [isHidden, setIsHidden] = useState(props.type === 'password');
  const [type, setType] = useState(() => {
    if (['number', 'phone'].includes(props.type)) return 'text';
    return props.type || 'text';
  });
  const inRef = useRef();
  const toggleHiddenPassword = () => {
    setType((prevType) => {
      setIsHidden((prev) => !prev);
      return prevType === 'password' ? 'text' : 'password';
    });
  };

  const inFocus = () => {
    inRef?.current?.focus();
  };

  const handleChange = (event) => {
    if (['checkbox', 'radio'].includes(props.type)) {
      return onChecked(event.target.checked);
    }

    if (props.type === 'number') {
      event.target.value = event.target.value.replace(/\D/g, '');
    }
    if (value === '' && event.target.value === '\n') {
      event.target.value = '';
    }
    onChange(event.target.value);
  };

  const handleChangeTextarea = (event) => {
    handleChange(event);
    /**@type HTMLInputElement*/
    const inEl = inRef.current;
    if (!inEl) return;
    inEl.style.height = '';
    inEl.style.height = inEl?.scrollHeight + 'px';
  };

  return (
    <div
      className={clsx({
        'input-container': true,
        'input--error': errorMess,
        'input--end': inputEnd,
        [className]: className,
        lg: size === 'lg',
        sm: size === 'sm',
      })}
    >
      {prefix && <div className="prefix">{prefix}</div>}
      {suffix && <div className="suffix">{suffix}</div>}
      {props.label && (
        <label
          htmlFor={props.id}
          title={props.title}
          className={clsx({
            'label-end': labelEnd,
            'input-label': true,
          })}
        >
          {props.label}
          {props.required && <span>*</span>}
        </label>
      )}
      {labelHidden && <label htmlFor={props.id}>&nbsp;</label>}
      {textarea ? (
        <textarea
          {...props}
          ref={inRef}
          value={value || ''}
          onChange={handleChangeTextarea}
          disabled={props.disabled || loading}
          className={clsx({[classNameInput]: classNameInput})}
        />
      ) : (
        <input
          {...props}
          ref={inRef}
          value={value || ''}
          type={type}
          onChange={handleChange}
          disabled={props.disabled || loading}
          className={clsx({[classNameInput]: classNameInput})}
        />
      )}

      {helpText && !errorMess && <p className="text--help">{helpText}</p>}
      {errorMess && <p className="text--error">{errorMess}</p>}
      {props.type === 'password' && isHidden && IconEye({onClick: toggleHiddenPassword})}
      {props.type === 'password' && !isHidden && IconEyeSlash({onClick: toggleHiddenPassword})}
      {icon &&
        !loading &&
        icon({
          onClick: (event) => {
            iconFocusInput && inFocus();
            props?.onClick && props?.onClick(event);
          },
        })}
      {loading && <AppLoading />}
    </div>
  );
}

export default AppInput;
