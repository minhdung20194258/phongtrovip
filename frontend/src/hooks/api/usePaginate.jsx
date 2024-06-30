import useFetchApi from './useFetchApi';
import useUrlParams from '@/hooks/useUrlParams.jsx';
import {AppButton} from '@/components/index.jsx';
import {IconChevron} from '@/components/Icons/AppIcon.jsx';
import clsx from 'clsx';

export default function usePaginate({
  url,
  defaultData = [],
  initLoad = true,
  keepPreviousData = false,
  presentData = null,
  defaultLimit = 20,
  defaultSort = 'createdAt:desc',
  initQueries = {},
  defaultAutoFetch = true,
  defaultQueries = {},
}) {
  const [queries, setQueries] = useUrlParams({
    defaultValue: {
      page: 0,
      sort: defaultSort,
      limit: defaultLimit,
      ...initQueries,
      ...defaultQueries,
    },
    isObject: true,
  });

  const {data, fetchApi, pageInfo, ...fetchApiHook} = useFetchApi({
    url,
    defaultData,
    initLoad,
    presentData,
    initQueries: queries,
  });

  const handleFetchApi = async (params = null, keepData = false) => {
    await fetchApi(url, {...queries, ...params}, keepData);
  };

  /**
   * @param newQueries {Object}
   * @param isFetch
   * @return {Promise<void>}
   */
  const onQueriesChange = async (newQueries, isFetch = true) => {
    setQueries((prev) => ({...prev, ...newQueries, ...defaultQueries}));
    if (isFetch && defaultAutoFetch) await handleFetchApi(newQueries);
  };

  const resetQueries = async (newQueries, isFetch = true) => {
    const newObj = {
      ...newQueries,
      page: 0,
      sort: defaultSort,
      limit: defaultLimit,
      ...defaultQueries,
    };
    setQueries((prev) => ({
      ...prev,
      ...newObj,
    }));
    if (isFetch && defaultAutoFetch) await fetchApi(url, newObj);
  };

  /**
   * @param checked {Boolean} is add or remove queries
   * @param field {string} field name
   * @param value {any}
   * @param isFetch {Boolean}
   * @return {Promise<void>}
   */
  const onQueriesChangeArray = async ({checked, field, value, isFetch = true}) => {
    let newQueries = [];
    if (checked) {
      newQueries = [...(queries[field] || []), value];
    } else {
      newQueries = (queries[field] || []).filter((i) => i !== value);
    }
    setQueries((prev) => ({...prev, [field]: newQueries}));
    if (isFetch) await handleFetchApi({[field]: newQueries});
  };

  const onPaginate = async (paginate = '') => {
    const page = (() => {
      switch (paginate) {
        case 'prev':
          return queries.page - 1;
        case 'next':
          return queries.page + 1;
        default:
          return 0;
      }
    })();
    await handleFetchApi({page}, keepPreviousData);
    setQueries((prev) => ({...prev, page, ...defaultQueries}));
  };

  // eslint-disable-next-line react/prop-types
  const PaginateButtonGroup = ({isCenter, className}) => (
    <div
      className={clsx({
        'd-flex gap-8': true,
        'w-full ai-c jc-c': isCenter,
        [className]: className,
      })}
    >
      <AppButton
        type="no-text-1"
        icon={() => <IconChevron type="prev" />}
        onClick={() => onPaginate('prev')}
        disabled={!pageInfo.hasPrev}
      />
      <AppButton
        type="no-text-1"
        icon={() => <IconChevron type="next" />}
        onClick={() => onPaginate('next')}
        disabled={!pageInfo.hasNext}
      />
    </div>
  );

  return {
    ...fetchApiHook,
    page: queries.page,
    pageInfo,
    prevPage: () => onPaginate('prev'),
    nextPage: () => onPaginate('next'),
    onQueriesChange,
    onQueriesChangeArray,
    resetQueries,
    setQueries,
    queries,
    data,
    fetchApi,
    reFresh: handleFetchApi,
    PaginateButtonGroup,
  };
}
