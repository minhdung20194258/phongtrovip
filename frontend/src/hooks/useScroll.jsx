import {useEffect} from 'react';

useScroll.propTypes = {};

function useScroll(ref, initScroll = true) {
  const handleScroll = () => {
    if (!ref.current) return;

    ref.current?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    initScroll && setTimeout(() => handleScroll(), 300);
  }, []);

  return {handleScroll};
}

export default useScroll;
