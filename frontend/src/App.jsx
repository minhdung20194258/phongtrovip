import {useDispatch, useSelector} from 'react-redux';
import {getUser, thunkAutoSignIn, thunkSignGoogle} from '@/reducers/authSlice.js';
import {useEffect, useMemo} from 'react';
import ValidationRouter from '@/router/ValidationRouter.jsx';
import useEventDefault from '@/hooks/useEventDefault.jsx';
import useChatSocket from '@/hooks/chats/useChatSocket.jsx';
import {useLocation, useNavigate} from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const urlParams = useMemo(() => new URLSearchParams(location.search), [location]);
  useEffect(() => {
    if (urlParams.get('auth') === 'google' && urlParams.get('accessToken')) {
      dispatch(thunkSignGoogle(urlParams.get('accessToken')));
      navigate('/');
    }
  }, []);

  useChatSocket();
  useEventDefault();

  useEffect(
    () => () => {
      dispatch(thunkAutoSignIn());
    },
    [dispatch],
  );

  useEffect(() => {
    window.userRef = user;
  }, [user]);

  return <ValidationRouter />;
}
