import {AppContainer, AppSeperateText, AppToggle} from '@/components/index.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import PropTypes from 'prop-types';
import {showReviewOptions} from '@/const/options/filterOptions.js';
import {REVIEW_REPORT_USER} from 'backend/const/types/reviewTypes.mjs';
import {reportOptions} from '@/const/options/reportOptions.js';
import {formatFullTime} from '@/helper/format/formatTime.js';

Reports.propTypes = {
  isStaff: PropTypes.bool,
};

function Reports() {
  const {data, reFresh, onQueriesChange, PaginateButtonGroup} = usePaginate({
    url: `/reviews/filter?type=${REVIEW_REPORT_USER}`,
    defaultData: [],
    defaultQueries: {
      limit: 10,
      isReported: true,
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
          <div className="fs-14 fw-700 col-1p7 d-center">Nguời tạo</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Avatar</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Bị báo cáo</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Avatar</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Ngày tạo</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Lý do</div>
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
              <div className="col-1p7 d-flex jc-c">
                <img
                  src={review.user?.avatar?.url || '/default-avatar.png'}
                  alt={''}
                  className="avatar"
                />
              </div>
              <div className="col-1p7 fw-500 d-flex-col ai-c gap-4">
                <div>{review.reportedUser?.fullName}</div>
                <div>{review.reportedUser?.email}</div>
              </div>
              <div className="col-1p7 d-flex jc-c">
                <img
                  src={review.reportedUser?.avatar?.url || '/default-avatar.png'}
                  alt={''}
                  className="avatar"
                />
              </div>
              <div className="col-1p7 d-flex-col ai-c">{formatFullTime(review.createdAt)}</div>
              <div className="col-1p7 d-flex-col">
                {(review.reasons || []).map((item, index) => {
                  const reason = reportOptions.find((i) => i.value === item);
                  return <div key={index}>- {reason.title}</div>;
                })}
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

export default Reports;
