import {AppBadge, AppContainer, AppSeperateText, AppToggle} from '@/components/index.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import PropTypes from 'prop-types';
import {showReviewOptions} from '@/const/options/filterOptions.js';
import StarRateActions from '@/components/StarRateActions/StarRateActions.jsx';
import {REVIEW_APP} from 'backend/const/types/reviewTypes.mjs';
import {formatFullTime} from '@/helper/format/formatTime.js';

Reviews.propTypes = {
  isStaff: PropTypes.bool,
};

function Reviews() {
  const {data, reFresh, onQueriesChange, PaginateButtonGroup} = usePaginate({
    url: `/reviews/filter?type=${REVIEW_APP}`,
    defaultData: [],
    defaultQueries: {
      limit: 10,
    },
  });
  const {handleEdit, editing} = useEditApi({
    url: '/admin/reviews',
    successCallback: reFresh,
  });
  const {btnTabs} = useTabs({
    tabs: showReviewOptions,
    initSelected: null,
    size: 'lg',
    onTab: (id) => onQueriesChange({isAdminHidden: id, page: 0}),
  });

  return (
    <AppContainer className="App-AdminContent App-AdminAccount" paddingInline={24}>
      <div className="AdminContent__Filter">{btnTabs}</div>
      <div className="d-flex-col gap-24">
        <div className="row gap-12 pt-12 pb-12 bg-50">
          <div className="fs-14 fw-700 w-48 d-center">STT</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Tên</div>
          <div className="fs-14 fw-700 flex-1 d-center">Avatar</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Ngày tạo</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Số sao</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Trạng thái</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Nội dung</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Hành động</div>
        </div>
        {data.map((review, index) => (
          <div key={review._id}>
            <div className="row gap-12 mb-24">
              <div className="w-48 pl-8 fw-600">{index + 1}</div>
              <div className="col-1p7 fw-500 d-flex-col ai-c gap-4">
                <div>{review.user?.fullName}</div>
                <div>{review.user?.email}</div>
              </div>
              <div className="flex-1 d-flex jc-c">
                <img
                  src={review.user?.avatar?.url || '/default-avatar.png'}
                  alt={''}
                  className="avatar"
                />
              </div>
              <div className="col-1p7 d-flex-col ai-c">{formatFullTime(review.createdAt)}</div>
              <div className="col-1p7 d-flex-col ai-c fw-700">
                <StarRateActions currentRate={review.star} disabled={true} size="sm" />
              </div>
              <div className="col-1p7 d-flex-col ai-c">
                <AppBadge tone={!review.isAdminHidden ? 'success' : 'disabled'} nowrap={true}>
                  {!review.isAdminHidden ? 'Hiển thị' : 'Ẩn'}
                </AppBadge>
              </div>
              <div className="col-1p7">{review.content}</div>
              <div className="col-1p7 d-flex gap-8 jc-e">
                <AppToggle
                  checked={!review.isAdminHidden}
                  setChecked={(val) => handleEdit({isAdminHidden: !val}, review._id)}
                  loading={editing}
                />
              </div>
            </div>
            <AppSeperateText />
          </div>
        ))}
        <PaginateButtonGroup isCenter={true} className="mb-24" />
      </div>
    </AppContainer>
  );
}

export default Reviews;
