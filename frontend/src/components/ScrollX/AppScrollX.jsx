import {useCallback, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {AppButton} from '@/components/index.jsx';
import {IconChevron} from '@/components/Icons/AppIcon.jsx';
import './AppScrollX.scss';
import clsx from 'clsx';
import useOnClickOutside from '@/hooks/useOnClickOutSide.jsx';

AppScrollX.propTypes = {
  items: PropTypes.array,
};

function AppScrollX({items = []}) {
  const ref = useRef([]);
  const containerRef = useRef();
  const [currentX, setCurrentX] = useState(0);
  const [active, setActive] = useState(false);

  const getScrollInto = useCallback(
    (isNext) => {
      if (isNext) return currentX === items.length - 1 ? 0 : currentX + 1;
      return currentX === 0 ? items.length - 1 : currentX - 1;
    },
    [currentX, items.length],
  );

  const handleScroll = useCallback(
    (isNext = false) => {
      const scrollInto = getScrollInto(isNext);
      if (!ref.current[scrollInto]) return;

      ref.current[scrollInto].scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      });
      setCurrentX(scrollInto);
      !active && setActive(true);
    },
    [active, getScrollInto],
  );

  useOnClickOutside({ref: containerRef, handler: () => setActive(false)});

  return (
    <div className="App-ScrollX" ref={containerRef}>
      <AppButton
        type={'no-text-3'}
        size={'lg'}
        icon={() => <IconChevron type="prev" className={'w-32 h-32'} />}
        onClick={() => handleScroll(false)}
      />
      <div className="ScrollX__Items">
        {items.map((item, i) => (
          <div
            key={i}
            className={clsx({
              'ScrollX__Item--Container': true,
              active: i === currentX && active,
            })}
            onClick={() => {
              setCurrentX(i);
              !active && setActive(true);
            }}
            ref={(el) => (ref.current[i] = el)}
          >
            {item}
          </div>
        ))}
      </div>
      <AppButton
        type={'no-text-3'}
        size={'lg'}
        icon={() => <IconChevron type="next" className={'w-32 h-32'} />}
        onClick={() => handleScroll(true)}
      />
    </div>
  );
}

export default AppScrollX;
