import clientApi from '@/helper/clientApi';
import {useCallback, useEffect, useRef, useState} from 'react';
import queryString from 'query-string';
import {handleErrorApi} from '@/helper/handleError';

export default function useFetchApi({
  url,
  defaultData = [],
  initLoad = true,
  presentData = null,
  initQueries = {},
  defaultQueries = {},
}) {
  const [loading, setLoading] = useState(initLoad);
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState(defaultData);
  const [pageInfo, setPageInfo] = useState({});
  const [count, setCount] = useState(0);
  const useEffectRef = useRef(false);

  async function fetchApi(apiUrl, params = null, keepPreviousData = false) {
    try {
      setLoading(true);
      const path = apiUrl || url;
      const separateChar = path.includes('?') ? '&' : '?';
      const query = (() => {
        if (!params) return '';
        const queryParams = {};
        Object.keys(params).forEach((key) => {
          if (Array.isArray(params[key])) {
            queryParams[key] = params[key].join(',');
            return;
          }
          queryParams[key] = params[key];
        });
        return separateChar + queryString.stringify(queryParams);
      })();
      // const query = params ? separateChar + queryString.stringify(params) : '';

      const resp = await clientApi.get(path + query);
      if (resp.pageInfo) setPageInfo(resp.pageInfo);
      if (resp.count) setCount(resp.count);

      let newData = presentData ? presentData(resp) : resp.data;
      if (!Array.isArray(newData)) {
        newData = {...defaultData, ...newData};
      }
      setData((prev) => {
        if (!keepPreviousData) return newData;
        return Array.isArray(newData) ? [...prev, ...newData] : {...prev, ...newData};
      });
    } catch (error) {
      handleErrorApi(error);
      console.log(error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  /**
   * @param key
   * @param value
   */
  const handleChangeData = useCallback((key, value) => {
    setData((prev) => ({...prev, [key]: value}));
  }, []);
  /**
   * @param key
   * @param value
   */
  const toggleData = useCallback((key) => {
    setData((prev) => ({...prev, [key]: !prev[key]}));
  }, []);

  useEffect(() => {
    if (initLoad && !fetched && !useEffectRef.current) {
      fetchApi(url, {...initQueries, ...defaultQueries}).then();
      useEffectRef.current = true;
    }
  }, []);

  return {
    fetchApi,
    reFresh: fetchApi,
    reFreshInit: () => fetchApi(url, {...initQueries, ...defaultQueries}),
    data,
    setData,
    handleChangeData,
    toggleData,
    pageInfo,
    count,
    setCount,
    loading,
    fetched,
    setFetched,
  };
}
