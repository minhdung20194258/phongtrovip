import {useState, useRef, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import AppInput from '@/components/Input/AppInput.jsx';
import {IconCheck, IconChevron} from '@/components/Icons/AppIcon.jsx';
import clsx from 'clsx';
import './AppCombobox.scss';
import useOnClickOutside from '@/hooks/useOnClickOutSide.jsx';

AppCombobox.propTypes = {
  label: PropTypes.string,
  title: PropTypes.string,
  required: PropTypes.bool,
  errorMess: PropTypes.string,
  selected: PropTypes.any,
  size: PropTypes.oneOf(['sm', 'lg']),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.any,
      labelOption: PropTypes.any,
      prefix: PropTypes.any,
    }),
  ),
  onSelected: PropTypes.func,
  isReference: PropTypes.bool,
  isSearch: PropTypes.bool,

  disabled: PropTypes.bool,
  className: PropTypes.string,

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
};

// TODO: Add prefix for options and selected input
function AppCombobox({
  selected = '',
  onSelected = (_) => {},
  errorMess = '',
  options = [],
  isReference = false,
  size,
  isSearch = false,

  ...props
}) {
  const currentSelected = useMemo(
    () => options.find((item) => item.value === selected),
    [options, selected],
  );
  const indexSelected = useMemo(
    () => options.findIndex((item) => item?.value === selected),
    [options, selected],
  );

  const [showOptions, setShowOptions] = useState(false);
  const [searchFilter, setSearchFilter] = useState(currentSelected?.label);
  const [datasFilter, setDatasFilter] = useState([...options]);
  const [indexKeydown, setIndexKeydown] = useState(-1);
  const comboboxRef = useRef(null);

  useOnClickOutside({ref: comboboxRef, handler: () => setShowOptions(false)});

  const optionsRef = useRef([]);

  const toggleShowOptions = (event) => {
    event.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  const scrollIntoOptions = (index) => {
    const activeItem = optionsRef.current[index];

    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      setIndexKeydown((prev) => {
        if (!showOptions) {
          setShowOptions(true);
          return indexSelected >= 0 ? indexSelected : 0;
        }
        if (indexKeydown === 0) {
          return datasFilter.length - 1;
        }
        if (indexKeydown < 0) {
          return 0;
        }
        return prev - 1;
      });
    }
    if (event.key === 'ArrowDown') {
      setIndexKeydown((prev) => {
        if (!showOptions) {
          setShowOptions(true);
          return indexSelected >= 0 ? indexSelected : 0;
        }
        if (datasFilter.length === 0) {
          return -1;
        }
        return (prev + 1) % datasFilter.length;
      });
    }
    if (event.key === 'Enter') {
      if (!showOptions) {
        setShowOptions(true);
        setIndexKeydown(indexSelected);
        return;
      }
      if (datasFilter[indexKeydown]?.value === selected) {
        setShowOptions(false);
      }
      onSelected(datasFilter[indexKeydown]?.value);
      setSearchFilter(datasFilter[indexKeydown]?.label);
    }
  };

  // Set index when change selected
  useEffect(() => {
    setIndexKeydown(indexSelected);
  }, [indexSelected]);

  // Scroll when options
  useEffect(() => {
    if (showOptions) scrollIntoOptions(indexKeydown);
  }, [indexKeydown, showOptions]);

  // Search
  useEffect(() => {
    if (searchFilter === '' || searchFilter === currentSelected?.label) {
      setDatasFilter(() => [...options]);
      return () => {};
    }
    const filters = options.filter((item) => {
      return (item.labelOption || item.label)?.toLowerCase()?.includes(searchFilter?.toLowerCase());
    });
    setDatasFilter(() => filters);
  }, [searchFilter, options, currentSelected]);

  // Show option when change searchFilter
  useEffect(() => {
    if (searchFilter !== currentSelected?.label && !showOptions) {
      setShowOptions(true);
    }
  }, [searchFilter, showOptions, currentSelected]);

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
        value={searchFilter || ''}
        onChange={(e) => isSearch && setSearchFilter(e.target.value)}
        onClick={toggleShowOptions}
        errorMess={errorMess}
        onKeyDown={handleKeyUp}
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
        className={clsx({
          'App-Combobox__SelectOptions': !isSearch,
        })}
      />

      <div className="combobox-content" style={{display: !showOptions ? 'none' : 'block'}}>
        <ul>
          {isReference && <li className="item--placeholder">-Select option-</li>}
          {datasFilter.map((dataFilter, index) => (
            <li
              key={index}
              className={clsx({
                'item--checked': selected === dataFilter.value,
                'item--keydown': indexKeydown === index,
              })}
              onClick={(event) => {
                event.stopPropagation();
                onSelected(dataFilter?.value);
                setSearchFilter(dataFilter?.label);
                setShowOptions(false);
              }}
              ref={(el) => (optionsRef.current[index] = el)}
            >
              <div className="h-20 d-flex max-line-1-1">
                {dataFilter?.prefix}
                <span className={'pl-4'}>{dataFilter.labelOption || dataFilter.label}</span>
              </div>
              {selected === dataFilter.value && IconCheck()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AppCombobox;
