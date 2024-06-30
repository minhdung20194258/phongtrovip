import PropTypes from 'prop-types';
import './AppSeperateText.scss';
import clsx from 'clsx';
import {IconChevron} from '@/components/Icons/AppIcon.jsx';

AppSeperateText.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  classNameHr: PropTypes.string,
  classNameText: PropTypes.string,
  useCollapses: PropTypes.bool,
  collapse: PropTypes.bool,
  setCollapse: PropTypes.func,
};

function AppSeperateText({
  text = '',
  className,
  classNameHr,
  classNameText,
  useCollapses,
  collapse,
  setCollapse,
  ...props
}) {
  return (
    <div
      className={clsx({
        'seperate-or': true,
        [className]: className,
      })}
      {...props}
    >
      <div className="seperate-div">
        <div
          className={clsx({
            'seperate-hr': true,
            [classNameHr]: classNameHr,
          })}
        />
      </div>
      {text && (
        <div
          className={clsx({
            'seperate-txt': true,
            [classNameText]: classNameText,
          })}
        >
          {text}
        </div>
      )}
      {useCollapses && (
        <IconChevron type={collapse ? 'up' : 'down'} onClick={() => setCollapse((prev) => !prev)} />
      )}
      <div className="seperate-div">
        <div
          className={clsx({
            'seperate-hr': true,
            [classNameHr]: classNameHr,
          })}
        />
      </div>
    </div>
  );
}

export default AppSeperateText;
