import PostItem from '@/pages/Post/PostItem/PostItem.jsx';
import './PostPreview.scss';
import clsx from 'clsx';
import {AppButton, AppCard, AppContainer, AppInput, AppSeperateText} from '@/components/index.jsx';
import {IconSearchFilled, IconStarBold, IconTrash} from '@/components/Icons/AppIcon.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import {times} from 'lodash';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import {postSearchOptions, typeOfRoomOptions} from '@/const/options/postOptions.js';
import {splitMoney} from '@/helper/formats.js';
import {useCallback, useEffect, useState} from 'react';
import clientApi from '@/helper/clientApi.js';
import {useSelector} from 'react-redux';
import {getUserId} from '@/reducers/authSlice.js';
import {useDebounce} from '@/hooks/useDebounce.jsx';

PostPreview.propTypes = {};

const initQueries = {
  searchText: '',
  districts: [],
  wards: [],
  provinces: [],
  maxPrice: '',
  minPrice: '',
  reviews: [],
  typeOfRooms: [],
};
function PostPreview() {
  const userId = useSelector(getUserId);
  const {
    data: posts,
    setData: setPosts,
    onQueriesChange,
    onQueriesChangeArray,
    queries,
    pageInfo,
    prevPage,
    nextPage,
    reFresh,
  } = usePaginate({
    url: '/posts/filter',
    defaultData: [],
    defaultQueries: {
      limit: 20,
      isShowForUser: true,
      currentUserId: userId,
    },
    initQueries,
    defaultAutoFetch: false,
  });
  const debounceQuery = useDebounce(queries);
  useEffect(() => {
    reFresh();
  }, [debounceQuery]);
  const {data: provinces, loading: loadingProvinces} = useFetchApi({
    url: '/resource/areas',
    defaultData: [],
  });
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  useEffect(() => {
    if (loadingProvinces) return () => {};
    if (!queries.provinces?.length) {
      setDistricts([]);
      setWards([]);
      onQueriesChange({
        districts: [],
        wards: [],
      });
      return () => {};
    }
    if (queries.provinces?.length > 1) return () => {};

    (async () => {
      const resp = await clientApi(`/resource/areas/province/${queries.provinces[0]}`);
      setDistricts(resp.data);
      setWards([]);
    })();
  }, [queries.provinces, loadingProvinces]);
  useEffect(() => {
    if (loadingProvinces || queries.provinces?.length !== 1 || queries.districts?.length !== 1)
      return () => {};
    (async () => {
      const resp = await clientApi(
        `/resource/areas/district/${queries.districts[0]}/province/${queries.provinces[0]}`,
      );
      setWards(resp.data);
    })();
  }, [queries.districts, loadingProvinces]);

  const handleChecked = ({checked, field = '', Code}) => {
    if (!checked) {
      const queryItem = (queries[field] || []).filter((itemCode) => itemCode !== Code);
      return onQueriesChange({[field]: queryItem});
    }
    return onQueriesChange({[field]: [...(queries[field] || []), Code]});
  };

  const [collapses, setCollapses] = useState({});
  const toggleCollapse = useCallback(
    (field) => setCollapses((prev) => ({...prev, [field]: !prev[field]})),
    [],
  );

  return (
    <AppContainer className="d-flex">
      <div className="PostPreview__Filter scroll hidden-scrollbar">
        <div className="col-1p2"></div>
        <div className="col-1p2 d-flex-col gap-24">
          <AppButton
            icon={IconTrash}
            type="transparent"
            text="Xóa bộ lọc tìm kiếm"
            onClick={() => onQueriesChange(initQueries)}
            className="d-flex jc-e"
          />
          <AppInput
            label="Tìm kiếm"
            placeholder="Tìm kiếm theo tên hoặc nội dung"
            icon={IconSearchFilled}
            onChange={(val) => onQueriesChange({searchText: val})}
            value={queries.searchText || ''}
          />
          <div>
            <AppSeperateText text="Khoảng giá" classNameText="fs-18 fw-700 txt-up color-black" />
            <div className="row jc-sb mt-24">
              <div className="h-txt-14">Tối thiểu</div>
              <div className="h-txt-14">Tối đa</div>
            </div>
            <div className="row gap-4">
              <AppInput
                value={queries.minPrice || ''}
                placeholder="VD: 3.000.000"
                type="number"
                onChange={(val) => onQueriesChange({minPrice: splitMoney(val)})}
                suffix="đ"
                maxLength={12}
              />
              <AppInput
                value={queries.maxPrice || ''}
                type="number"
                placeholder="VD: 5.000.000"
                onChange={(val) => onQueriesChange({maxPrice: splitMoney(val)})}
                suffix="đ"
                maxLength={14}
              />
            </div>
          </div>
          <div>
            <AppSeperateText text="Diện tích" classNameText="fs-18 fw-700 txt-up color-black" />
            <div className="row jc-sb mt-24">
              <div className="h-txt-14">Tối thiểu</div>
              <div className="h-txt-14">Tối đa</div>
            </div>
            <div className="row gap-4">
              <AppInput
                value={queries.minArea || ''}
                placeholder="VD: 25"
                type="number"
                onChange={(val) => onQueriesChange({minArea: val})}
                suffix={
                  <p className="d-flex ai-s">
                    m<span className="fs-7">2</span>
                  </p>
                }
                maxLength={4}
              />
              <AppInput
                value={queries.maxArea || ''}
                type="number"
                placeholder="VD: 20"
                onChange={(val) => onQueriesChange({maxArea: val})}
                suffix={
                  <p className="d-flex ai-s">
                    m<span className="fs-7">2</span>
                  </p>
                }
                maxLength={4}
              />
            </div>
          </div>
          <div className="d-flex-col gap-12">
            <AppSeperateText
              text="Loại hình"
              classNameText="fs-18 fw-700 txt-up color-black"
              useCollapses={true}
              collapse={collapses.typeRoom}
              setCollapse={() => toggleCollapse('typeRoom')}
            />
            {!collapses.typeRoom &&
              typeOfRoomOptions.map((item) => (
                <AppInput
                  type="checkbox"
                  label={item.label}
                  key={item.value}
                  checked={(queries.typeOfRooms || []).includes(item.value)}
                  onChecked={(checked) =>
                    onQueriesChangeArray({
                      checked: checked,
                      field: 'typeOfRooms',
                      value: item.value,
                      isFetch: true,
                    })
                  }
                />
              ))}
          </div>
          <div className="d-flex-col gap-12">
            <AppSeperateText
              text="Đánh giá"
              classNameText="fs-18 fw-700 txt-up color-black"
              useCollapses={true}
              collapse={collapses.reviews}
              setCollapse={() => toggleCollapse('reviews')}
            />
            {!collapses.reviews &&
              times(5)
                .reverse()
                .map((_, i) => (
                  <AppInput
                    type="checkbox"
                    label={<IconStarBold times={i + 1} />}
                    checked={(queries.reviews || []).includes(i + 1)}
                    key={i + 'reviews'}
                    onChecked={(checked) =>
                      onQueriesChangeArray({
                        checked: checked,
                        field: 'reviews',
                        value: i + 1,
                        isFetch: true,
                      })
                    }
                  />
                ))}
          </div>
          <div className="d-flex-col gap-12">
            <AppSeperateText
              text="Tỉnh"
              classNameText="fs-18 fw-700 txt-up color-black"
              useCollapses={true}
              collapse={collapses.provinces}
              setCollapse={() => toggleCollapse('provinces')}
            />
            {!collapses.provinces && (
              <div className="d-flex-col gap-12 h-360 scroll">
                {provinces.map(({Code, FullName}) => (
                  <AppInput
                    type="checkbox"
                    label={FullName}
                    key={Code}
                    checked={(queries.provinces || []).includes(Code)}
                    onChecked={(checked) => handleChecked({checked, field: 'provinces', Code})}
                  />
                ))}
              </div>
            )}
          </div>
          {queries.provinces?.length === 1 && !!districts.length && (
            <div className="d-flex-col gap-12">
              <AppSeperateText
                text="Quận huyện"
                classNameText="fs-18 fw-700 txt-up color-black"
                useCollapses={true}
                collapse={collapses.districts}
                setCollapse={() => toggleCollapse('districts')}
              />
              {!collapses.districts && (
                <div className="d-flex-col gap-12 h-360 scroll">
                  {districts.map(({Code, FullName}) => (
                    <AppInput
                      type="checkbox"
                      label={FullName}
                      key={Code}
                      checked={(queries.districts || []).includes(Code)}
                      onChecked={(checked) => handleChecked({checked, field: 'districts', Code})}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {(queries.provinces?.length === 1 || queries.districts?.length === 1) &&
            !!wards.length && (
              <div className="d-flex-col gap-12">
                <AppSeperateText
                  text="Phường xã"
                  classNameText="fs-18 fw-700 txt-up color-black"
                  useCollapses={true}
                  collapse={collapses.wards}
                  setCollapse={() => toggleCollapse('wards')}
                />
                {!collapses.wards && (
                  <div className="d-flex-col gap-12 h-360 scroll">
                    {wards.map(({Code, FullName}) => (
                      <AppInput
                        type="checkbox"
                        label={FullName}
                        key={Code}
                        checked={(queries.wards || []).includes(Code)}
                        onChecked={(checked) => handleChecked({checked, field: 'wards', Code})}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
      <div className="PostPreview__Content">
        <div className="PostPreview__Content--Sort">
          <div className="h-txt-16 bd-r h-full d-center p-12 bg-grey-300">Sắp xếp</div>
          {postSearchOptions.map((item) => (
            <div
              className={clsx({
                'fw-500 bd-r h-full d-center pr-24 pl-24  pointer': true,
                'bg-50': queries.sort === item.value,
              })}
              key={item.value}
              onClick={() => onQueriesChange({sort: item.value})}
            >
              {item.label}
            </div>
          ))}
        </div>
        <AppCard
          className="PostPreview__Content--Card"
          isEmpty={!posts.length}
          isUseScrollPagination={false}
          {...{pageInfo, prevPage, nextPage}}
        >
          {posts.map((post) => (
            <PostItem post={post} key={post._id} setPosts={setPosts} />
          ))}
        </AppCard>
      </div>
    </AppContainer>
  );
}

export default PostPreview;
