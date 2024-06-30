import SignIn from '@/pages/Auth/SignIn/SignIn.jsx';
import {IconClose} from '@/components/Icons/AppIcon.jsx';
import AppButton from '../../components/Button/AppButton.jsx';
import './styles/ModalSignIn.scss';
import {useDispatch, useSelector} from 'react-redux';
import {getIsShowModalSignIn, setShowModalSignIn} from '@/reducers/layout/layoutSlice.js';

useModalSignIn.propTypes = {};

function useModalSignIn() {
  const isShowModalSignIn = useSelector(getIsShowModalSignIn);
  const dispatch = useDispatch();

  const modal = isShowModalSignIn && (
    <div className="modal SignInModal">
      <SignIn>
        <AppButton
          className="modal-close"
          type="no-text-2"
          icon={() => IconClose({className: 'w-20'})}
          onClick={() => dispatch(setShowModalSignIn(false))}
        />
      </SignIn>
    </div>
  );

  return {modal, open, openModal: () => dispatch(setShowModalSignIn(true))};
}

export default useModalSignIn;
