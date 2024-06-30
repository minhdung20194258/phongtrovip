import {useState} from 'react';
import {useDispatch} from 'react-redux';
import clientApi from '@/helper/clientApi';
import {setToast} from '@/reducers/layout/toastSlice.js';

/**
 * @param url
 * @param defaultState
 * @param fullResp
 * @param useToast
 * @param successCallback
 * @param successMsg
 * @param errorMsg
 * @returns {{deleting: boolean, handleDelete}}
 */
export default function useDeleteApi({
  url,
  defaultState = false,
  fullResp = false,
  useToast = true,
  successCallback = () => {},
  successMsg = 'Xóa item thành công',
  errorMsg = 'Xảy ra lỗi',
}) {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(defaultState);

  /**
   * @param id
   * @param data
   * @return {Promise<axios.AxiosResponse<any>|boolean|{success: boolean, error}>}
   */
  const handleDelete = async (id = '', data = {}) => {
    try {
      setDeleting(true);
      const resp = await clientApi(id ? `${url}/${id}` : url, {
        method: 'DELETE',
        body: data,
      });
      if (resp.success) {
        useToast && dispatch(setToast({content: resp.message || successMsg}));
        successCallback(resp);
      }
      if (resp.error) {
        dispatch(setToast({content: resp.error, error: true}));
      }
      return fullResp ? resp : resp.success;
    } catch (e) {
      console.log(e);
      dispatch(setToast({content: errorMsg, error: true}));
      return fullResp ? {success: false, error: e.message} : false;
    } finally {
      setDeleting(false);
    }
  };

  return {deleting, handleDelete};
}
