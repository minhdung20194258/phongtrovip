import PropTypes from 'prop-types';
import {times} from 'lodash';
import clsx from 'clsx';
import './AppProcessBarStep.scss';

AppProcessBarStep.propTypes = {
  step: PropTypes.number,
  maxSteps: PropTypes.number,
  onClickStep: PropTypes.func,
  message: PropTypes.array,
};

function AppProcessBarStep({step = 0, maxSteps = 3, message = [], onClickStep = (_) => {}}) {
  return (
    <div className="d-flex">
      {times(maxSteps).map((item, index) => (
        <div className="d-flex" key={index}>
          <div
            className={clsx({
              'circle-36 d-center fs-18 fw-500': true,
              'pointer p-relative': true,
              'bg-500 color-white': index + 1 <= step,
              'bg-grey-500 color-white': index + 1 > step,
            })}
            onClick={() => onClickStep(index + 1)}
          >
            {index + 1}
            <div className="App-ProcessBarStep__Message">{message[index]}</div>
          </div>
          {index + 1 !== maxSteps && (
            <div className="App-ProcessBarStep__Process">
              <div
                className={clsx({
                  'w-full h-3 process-bar': true,
                  'bg-500': index + 2 <= step,
                  'bg-grey-500': index + 2 > step,
                })}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AppProcessBarStep;
