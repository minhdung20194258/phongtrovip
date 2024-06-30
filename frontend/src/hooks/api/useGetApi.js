import {useState} from 'react';
import {fetchAuthenticatedApi, store} from '../../helpers';
import {setToast} from '../../actions/layout/setToastAction';
import stringify from 'qs-stringify';

/**
 *
 * @param url
 * @param defaultState
 * @param fullResp
 * @param useToast
 * @param catchError
 * @param successCallback
 * @param errorCallback
 * @param successMsg
 * @param errorMsg
 * @returns {{loading: boolean, handleGet: ((function({}=): Promise<{success: boolean, error}>)|*)}}
 */
export default function useGetApi({
  url,
  defaultState = false,
  fullResp = false,
  useToast = true,
  catchError = true,
  successCallback = _p => {},
  errorCallback = _p => {},
  successMsg = 'Saved successfully',
  errorMsg = 'Failed to save'
}) {
  const [loading, setLoading] = useState(defaultState);

  /**
   * @returns {Promise<{success: boolean, error}>}
   */
  const handleGet = async params => {
    try {
      setLoading(true);
      const resp = await fetchAuthenticatedApi(url + '?' + stringify(params), {method: 'GET'});
      if (resp.success) {
        useToast && store.dispatch(setToast({content: resp.message || successMsg}));
        successCallback(resp);
      }
      if (!resp.success) {
        errorCallback(resp);
      }
      if (resp.error) {
        store.dispatch(setToast({content: resp.error, error: true}));
      }
      return fullResp ? resp : resp.success;
    } catch (e) {
      if (!catchError) throw new Error(e);
      console.log(e);
      store.dispatch(setToast({content: errorMsg, error: true}));
      return fullResp ? {success: false, error: e.message} : false;
    } finally {
      setLoading(false);
    }
  };

  return {loading, handleGet};
}
