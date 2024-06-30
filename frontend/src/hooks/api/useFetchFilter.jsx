import querystring from 'query-string';
import {useState} from 'react';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';

export default function useFetchBasicGrid({
  apiUrl,
  defaultSortValue = 'sort',
  defaultFetchFilter = {},
  initFetchFilter = {},
}) {
  const [filters, setFilters] = useState({});
  const {
    data,
    loading,
    fetched,
    reFetch,
    total,
    setTotal,
    pagination,
    setPagination,
    setLoading,
    setData,
  } = useFetchApi({
    url: `${apiUrl}?${querystring.stringify({...defaultFetchFilter, ...initFetchFilter})}`,
  });
  const [sortValue, setSortValue] = useState(defaultSortValue);
  const [afterPage, setAfterPage] = useState(null);

  const handleChangeFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReFetchByQuery = async (customFilters = {}) => {
    const {page, before} = customFilters;
    if (customFilters.searchText) setTotal(0);

    const queryFilters = filters;
    setFilters((prev) => ({
      ...defaultFetchFilter,
      ...prev,
      ...customFilters,
    }));
    if (sortValue && !customFilters.sort) {
      queryFilters['sort'] = sortValue;
    }
    await reFetch(`${apiUrl}?${querystring.stringify({...queryFilters, ...customFilters})}`);
    if (page && !before)
      setAfterPage((prev) => ({
        ...prev,
        [page]: page === 1 ? null : pagination.nextCursor,
      }));
  };

  const handleReFetchByDefault = () => {
    setFilters(defaultFetchFilter);
    reFetch(`${apiUrl}?${querystring.stringify(defaultFetchFilter)}`);
  };

  const onSortChange = (selected) => {
    setSortValue(selected);
    handleReFetchByQuery({sort: selected});
  };

  return {
    data,
    total,
    loading,
    fetched,
    reFetch,
    setFilters,
    setSortValue,
    onSortChange,
    sortValue,
    pagination,
    setPagination,
    handleChangeFilters,
    filters,
    handleReFetchByQuery,
    setLoading,
    setData,
    handleReFetchByDefault,
    afterPage,
  };
}
