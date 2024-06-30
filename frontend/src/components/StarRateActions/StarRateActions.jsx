import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import './StarRateActions.scss';
import {getStatusStar} from '@/helper/post.jsx';
import clsx from 'clsx';

StarRateActions.propTypes = {
  currentRate: PropTypes.number,
  onClick: PropTypes.func,
  showStatus: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  translation: PropTypes.object,
};

function StarRateActions({
  currentRate,
  onClick,
  showStatus = false,
  disabled = false,
  className,
  size,
}) {
  const [status, setStatus] = useState('');
  const ref = useRef(null);

  const getColorStar = (rateIndex, rateHover, isHover) => {
    if (
      (rateIndex <= currentRate && (rateIndex > rateHover || !isHover)) ||
      (rateIndex <= rateHover && !currentRate)
    )
      return '#FFBE21';
    if (rateIndex <= rateHover) return '#E0A71D';
    return '#C0C0C0';
  };

  const handleChangeStyle = (rate, isHover = false) => {
    const blockFather = ref.current ? ref.current : document.querySelector('.App-ActionRate');
    const blockRateFather = blockFather.querySelectorAll('svg');
    const blockRate = blockFather.querySelectorAll('svg path');
    for (let i = 0; i < 5; i++) {
      blockRate[i].style.fill = getColorStar(i + 1, rate, isHover);
      blockRateFather[i].style.transform = rate > i && isHover ? 'scale(1.2)' : 'scale(1)';
    }
  };

  useEffect(() => {
    onMouseOut();
  }, [currentRate]);

  const onMouseOver = (rate) => {
    setStatus(getStatusStar(rate));
    handleChangeStyle(rate, true);
  };

  const onMouseOut = () => {
    setStatus(getStatusStar(currentRate));
    handleChangeStyle(currentRate);
  };

  return (
    <div
      className={clsx({
        'App-ActionRate': true,
        [className]: className,
        [size]: size,
      })}
      ref={ref}
    >
      <div className="ActionRate__Star">
        {[...new Array(5)].map((item, i) => {
          const rate = i + 1;
          return (
            <svg
              key={rate}
              width="40"
              height="40"
              viewBox="-5 0 44 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => !disabled && onClick(rate)}
              onMouseOver={() => !disabled && onMouseOver(rate)}
              onMouseOut={() => !disabled && onMouseOut}
            >
              <path
                d="M16.0919 0.968664C16.4494 0.193792 17.5506 0.193793 17.9081 0.968665L21.9851 9.80764C22.1307 10.1234 22.43 10.3409 22.7754 10.3818L32.4416 11.5279C33.289 11.6284 33.6293 12.6758 33.0028 13.2552L25.8563 19.864C25.601 20.1001 25.4867 20.452 25.5545 20.7931L27.4515 30.3404C27.6178 31.1774 26.7269 31.8247 25.9822 31.4079L17.4884 26.6534C17.185 26.4835 16.815 26.4835 16.5116 26.6534L8.01776 31.4079C7.27314 31.8247 6.38219 31.1774 6.54849 30.3404L8.44553 20.7931C8.51331 20.452 8.39899 20.1001 8.14365 19.864L0.99716 13.2551C0.37066 12.6758 0.710978 11.6284 1.55837 11.5279L11.2246 10.3818C11.57 10.3409 11.8693 10.1234 12.0149 9.80764L16.0919 0.968664Z"
                fill={currentRate >= rate ? '#FFBE21' : '#C0C0C0'}
              />
            </svg>
          );
        })}
      </div>
      {showStatus && <div className="ActionRate__Status h-20">{status}</div>}
    </div>
  );
}

export default StarRateActions;
