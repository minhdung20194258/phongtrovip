import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {addQuery, getQuery, isDeleteQuery} from '@/helper/queryUrl.js';
import {useDebounce} from '@/hooks/useDebounce.jsx';

/**
 * @param name {string | object}
 * @param defaultValue {any} =>>> Nếu là object thì cần define rõ ra có field nào
 * @param isInt {boolean}
 * @param isObject {boolean}
 * @returns {[unknown,(value: unknown) => void]}
 */
export default function useUrlParams({
  name = '',
  defaultValue = '',
  isInt = false,
  isObject = false,
}) {
  const [query, setQuery] = useState(getQuery({name, defaultValue, isInt, isObject}));
  const location = useLocation();
  const navigate = useNavigate();
  const debounceQuery = useDebounce(query);

  const handleQuery = useCallback(() => {
    const urlParams = new URLSearchParams(decodeURI(location.search));
    const replaceQuery = () =>
      navigate(encodeURI(`${location.pathname}?${urlParams.toString()}`), {replace: true});

    if (!isObject || typeof query !== 'object') {
      isDeleteQuery(query, defaultValue)
        ? urlParams.delete(name)
        : addQuery({urlParams, name: name, value: query});
      return replaceQuery();
    }
    Object.keys(defaultValue).forEach((key) => {
      const nameKeySearch = name?.[key] ?? key;
      isDeleteQuery(query[key], defaultValue[key])
        ? urlParams.delete(nameKeySearch)
        : addQuery({urlParams, name: nameKeySearch, value: query[key]});
    });
    return replaceQuery();
  }, [defaultValue, isObject, location.pathname, location.search, name, navigate, query]);

  useEffect(() => {
    handleQuery();
  }, [debounceQuery]);

  return [query, setQuery];
}
