import {useState} from 'react';
import clientApi from '@/helper/clientApi';
import {useDispatch} from 'react-redux';
import {setToast} from '@/reducers/layout/toastSlice.js';

export default function useCreateApi({
  url,
  defaultState = false,
  fullResp = false,
  useToast = true,
  catchError = true,
  successCallback = () => {},
  errorCallback = () => {},
  successMsg = 'Tạo mới thành công',
  errorMsg = 'Xảy ra lỗi',
}) {
  const [creating, setCreating] = useState(defaultState);
  const [errorBE, setErrorBE] = useState('');
  const dispatch = useDispatch();

  /**
   * @param data
   * @returns {Promise<{success: boolean, error}>}
   */
  const handleCreate = async (data = {}) => {
    try {
      setCreating(true);
      const resp = await clientApi.post(url, data);
      if (resp.success) {
        useToast && dispatch(setToast({content: resp.message || successMsg}));
        successCallback(resp);
      }
      if (!resp.success) {
        setErrorBE(resp.message);
        errorCallback(resp);
        dispatch(setToast({content: resp.message || errorMsg, type: 'error'}));
      }
      // if (resp.error) {
      //   dispatch(setToast({content: resp.error, type: 'error'}));
      // }
      return fullResp ? resp : resp.success;
    } catch (e) {
      dispatch(setToast({content: errorMsg, type: 'error'}));
      if (!catchError) throw new Error(e);
      return fullResp ? {...e.response?.data, success: false, message: e.message} : false;
    } finally {
      setCreating(false);
    }
  };

  return {creating, handleCreate, errorBE, setErrorBE};
}
