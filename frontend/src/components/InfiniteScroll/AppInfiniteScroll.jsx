/* eslint-disable */
import {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {AppLoading} from '@/components/index.jsx';
import clsx from 'clsx';
import {debounce} from '@/helper/debounce.js';

AppInfiniteScroll.propTypes = {
  children: PropTypes.any,
  fetchMore: PropTypes.func,
  hasMore: PropTypes.bool,
  endMessage: PropTypes.any,
  className: PropTypes.string,
};

function AppInfiniteScroll({children, fetchMore, hasMore, endMessage, className}) {
  const [fetching, setFetching] = useState(false);
  const pageEndRef = useRef(null);
  const pageScrollRef = useRef(null);
  const debounceFetchMore = useCallback(
    debounce(async () => {
      try {
        if (fetching) return;
        setFetching(true);
        await fetchMore();
      } catch (e) {
        console.log(e);
      } finally {
        setFetching(false);
      }
    }, 200),
    [fetchMore],
  );

  useEffect(() => {
    if (!hasMore) return () => {};

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debounceFetchMore();
        }
      },
      {
        root: pageScrollRef.current ? pageScrollRef.current : document,
        threshold: 0,
      },
    );

    if (pageEndRef.current) {
      observer.observe(pageEndRef.current);
    }

    return () => {
      if (!pageEndRef.current) return;

      observer.unobserve(pageEndRef.current);
    };
  }, [hasMore, fetchMore]);

  return (
    <div
      className={clsx({
        [className]: className,
      })}
      style={{height: '100%', width: '100%'}}
      ref={pageScrollRef}
    >
      {children}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {hasMore ? (
          <div ref={pageEndRef}>
            <AppLoading />
          </div>
        ) : (
          endMessage
        )}
      </div>
    </div>
  );
}

export default AppInfiniteScroll;
