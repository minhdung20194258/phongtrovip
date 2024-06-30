import {useState} from 'react';
import {useDispatch} from 'react-redux';
import clientApi from '@/helper/clientApi';
import {setToast} from '@/reducers/layout/toastSlice.js';

export default function useEditApi({
  url,
  defaultState = false,
  fullResp = false,
  useToast = true,
  successCallback = () => {},
  successMsg = 'Chỉnh sửa thành công',
  errorMsg = 'Xảy ra lỗi',
}) {
  const [editing, setEditing] = useState(defaultState);
  const [errorBE, setErrorBE] = useState('');
  const dispatch = useDispatch();

  const handleEdit = async (data = {}, id) => {
    try {
      setEditing(true);
      setErrorBE('');
      const resp = await clientApi.put(`${url}${id ? '/' + id : ''}`, data);
      if (resp.success) {
        useToast && dispatch(setToast({content: resp.message || successMsg}));
        successCallback(resp);
      }
      if (!resp.success) {
        useToast && dispatch(setToast({content: resp.message, type: 'error'}));
        setErrorBE(resp.message);
      }
      return fullResp ? resp : resp.success;
    } catch (e) {
      console.log(e);
      useToast && dispatch(setToast({content: errorMsg, type: 'error'}));
      setErrorBE(e.message);
      return fullResp ? {success: false, error: e.message} : false;
    } finally {
      setEditing(false);
    }
  };

  return {editing, handleEdit, errorBE, setErrorBE};
}
