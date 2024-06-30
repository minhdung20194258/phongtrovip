import AppButton from '@/components/Button/AppButton';
import {useDispatch} from 'react-redux';
import {setShow} from '@/reducers/layout/dialogSlice.js';

export default function TestPage() {
  let dispatch = useDispatch();

  return (
    <div>
      <AppButton onClick={() => dispatch(setShow(true))}>Increment</AppButton>
      <AppButton onClick={() => dispatch(setShow(false))}>Decrement</AppButton>
    </div>
  );
}
