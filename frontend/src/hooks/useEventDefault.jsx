import {useEffect} from 'react';
import {DEVICE_DESKTOP, DEVICE_MOBILE, MOBILE_SIZE} from '@/const/layout.js';
import {setDevice} from '@/reducers/layout/layoutSlice.js';
import {useDispatch} from 'react-redux';

function useEventDefault() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleChangeResize = () => {
      if (window.innerWidth <= MOBILE_SIZE) {
        return dispatch(setDevice(DEVICE_MOBILE));
      }
      if (window.innerWidth > MOBILE_SIZE) {
        return dispatch(setDevice(DEVICE_DESKTOP));
      }
    };

    window.addEventListener('resize', handleChangeResize);
    return () => window.removeEventListener('resize', handleChangeResize);
  }, [dispatch]);
}

export default useEventDefault;
