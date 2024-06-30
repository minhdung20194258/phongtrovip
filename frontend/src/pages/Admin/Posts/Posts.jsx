import {AppBadge, AppButton, AppContainer, AppInput, AppSeperateText} from '@/components/index.jsx';
import {IconSearchFilled} from '@/components/Icons/AppIcon.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import moment from 'moment';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import {splitMoney} from '@/helper/formats.js';
import {findResetKeys, showOptions} from '@/const/options/filterOptions.js';
import {getPlan} from 'backend/const/plans.mjs';
import {PostStatusBadge} from '@/helper/post.jsx';
import {formatFullTime} from '@/helper/format/formatTime.js';

Posts.propTypes = {};

function Posts() {
  const {data, reFresh, onQueriesChange, resetQueries, queries, PaginateButtonGroup} = usePaginate({
    url: '/posts/filter',
    defaultData: [],
    defaultQueries: {
      limit: 20,
      isLookupUser: true,
    },
  });
  const {handleEdit, editing} = useEditApi({
    url: '/admin/posts',
    successCallback: () => reFresh(),
  });
  const {btnTabs} = useTabs({
    tabs: showOptions,
    initSelected: 1,
    size: 'lg',
    onSelect: ({key, value}) => {
      const newQueries = {[key]: value};
      findResetKeys(key).forEach((reset) => (newQueries[reset] = null));
      resetQueries(newQueries);
      console.log({newQueries});
    },
  });

  return (
    <AppContainer className="App-AdminContent App-AdminAccount" paddingInline={40}>
      <div className="AdminContent__Filter">
        {btnTabs}
        <AppInput
          placeholder="Tìm kiếm theo tên hoặc email"
          icon={IconSearchFilled}
          value={queries?.searchText}
          onChange={(val) => onQueriesChange({searchText: val})}
          className="w-400"
        />
      </div>
      <div className="d-flex-col gap-24">
        <div className="row gap-12 pt-12 pb-12 bg-50">
          <div className="fs-14 fw-700 w-48 d-center">STT</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Tiêu đề</div>
          <div className="fs-14 fw-700 flex-1 d-center" style={{minWidth: '100px'}}>
            Ảnh chính
          </div>
          <div className="fs-14 fw-700 col-1p7 d-center">Ngày tạo</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Ngày hết hạn</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Giá</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Loại tin</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Người tạo</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Thanh toán</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Trạng thái</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Hành động</div>
        </div>
        {data.map(({user, ...post}, index) => (
          <div key={post._id}>
            <div className="row gap-12 mb-48">
              <div className="w-48 pl-8 fw-600">{index + 1}</div>
              <div className="col-1p7 fw-500 d-flex jc-c">{post.title}</div>
              <div className="flex-1 d-center" style={{minWidth: '100px'}}>
                <img
                  src={post.images[0]?.url || '/dummy-image.png'}
                  alt={''}
                  className="w-full h-full pointer"
                  onClick={() => window.open(`/posts/${post._id}`, '_blank')}
                />
              </div>
              <div className="col-1p7 d-flex-col ai-c">{formatFullTime(post.createdAt)}</div>
              <div className="col-1p7 d-flex-col ai-c">
                {formatFullTime(post.subscriptionEndAt)}
              </div>
              <div className="col-1p7 d-flex-col ai-c fw-700">{splitMoney(post.price)}đ</div>
              <div className="col-1p7 d-flex-col ai-c fw-700">
                <AppBadge tone="success" nowrap={true}>
                  {getPlan(post.plan).name}
                </AppBadge>
              </div>
              <div className="col-1p7 d-flex-col ai-c">
                <div className="circle-72">
                  <img
                    src={user.avatar?.url || '/default-avatar.png'}
                    alt={''}
                    className="avatar"
                    onClick={() => window.open(`/user/show/${user._id}`)}
                  />
                </div>
                <div className="fw-700 txt-c">{user.fullName}</div>
                <div className="fs-11 txt-c">{user.email}</div>
              </div>
              <div className="col-1p7 d-flex-col ai-c">
                <AppBadge tone={post.isAutoPaying ? 'success' : 'disabled'} nowrap={true}>
                  {post.isAutoPaying ? 'Auto' : 'Thủ công'}
                </AppBadge>
              </div>
              <div className="col-1p7 d-flex-col ai-c">
                <PostStatusBadge post={post} />
              </div>
              <div className="col-1p7 d-flex-col ai-e gap-8">
                <AppButton
                  onClick={() => handleEdit({isAdminHidden: false, userId: post.userId}, post._id)}
                  loading={editing}
                  text="Đồng ý"
                />
                <AppButton
                  type="secondary"
                  onClick={() => handleEdit({isAdminHidden: true, userId: post.userId}, post._id)}
                  loading={editing}
                  text="Từ chối"
                />
              </div>
            </div>
            <AppSeperateText />
          </div>
        ))}
        <PaginateButtonGroup className="w-full d-center" />
      </div>
    </AppContainer>
  );
}

export default Posts;
