import {AppBadge, AppButton, AppContainer, AppInput, AppSeperateText} from '@/components/index.jsx';
import {
  IconEdit,
  IconKey,
  IconLock,
  IconPen,
  IconSearchFilled,
  IconUnlock,
} from '@/components/Icons/AppIcon.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {useDispatch} from 'react-redux';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import {upperFirst} from 'lodash';
import useAccountForm from '@/pages/Admin/Accounts/useAccountForm.jsx';
import useChangePasswordAdmin from '@/pages/Auth/ChangePassword/useChangePasswordAdmin.jsx';
import PropTypes from 'prop-types';
import {showUserOptions} from '@/const/options/filterOptions.js';
import {formatFullTime} from '@/helper/format/formatTime.js';

Accounts.propTypes = {
  isStaff: PropTypes.bool,
};

function Accounts({isStaff = false}) {
  const dispatch = useDispatch();
  const {data, reFresh, onQueriesChange, queries, PaginateButtonGroup} = usePaginate({
    url: '/users/filter',
    defaultData: [],
    defaultQueries: {
      limit: 20,
      isStaff,
    },
  });
  const {handleEdit, editing} = useEditApi({
    url: '/admin/users',
    successCallback: reFresh,
  });
  const {modal, openModal} = useAccountForm(reFresh);
  const {modal: changePasswordModal, openModal: openChangePasswordModal} = useChangePasswordAdmin();
  const {btnTabs} = useTabs({
    tabs: showUserOptions,
    initSelected: null,
    size: 'lg',
    onTab: (id) => onQueriesChange({isActive: id, page: 0}),
  });
  const confirmDisableUser = (account = {}) => {
    dispatch(
      setDialog({
        type: 'warning',
        content: (
          <p>
            Bạn muốn {account.isActive ? 'khoá' : 'mở khóa'}
            <span className="fw-600"> {account.fullName}</span>
          </p>
        ),
        onAccept: () => handleEdit({isActive: !account.isActive}, account._id),
        loading: editing,
      }),
    );
  };

  return (
    <AppContainer className="App-AdminContent App-AdminAccount" paddingInline={120}>
      {modal}
      {changePasswordModal}
      <div className="AdminContent__Filter">
        {btnTabs}
        <div className="w-400 d-flex gap-12">
          <AppInput
            placeholder="Tìm kiếm theo tên hoặc email"
            icon={IconSearchFilled}
            value={queries?.searchText}
            onChange={(val) => onQueriesChange({searchText: val})}
          />
          <AppButton icon={IconPen} onClick={() => openModal({})}>
            Thêm mới
          </AppButton>
        </div>
      </div>
      <div className="d-flex-col gap-24">
        <div className="row gap-12 pt-12 pb-12 bg-50">
          <div className="fs-14 fw-700 w-48 d-center">STT</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Tên</div>
          <div className="fs-14 fw-700 flex-1 d-center">Avatar</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Ngày tạo</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Số bài đăng</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Trạng thái</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Role</div>
          <div className="fs-14 fw-700 col-1p7 d-center">Hành động</div>
        </div>
        {data.map((account, index) => (
          <div key={account._id}>
            <div className="row gap-12 mb-24">
              <div className="w-48 pl-8 fw-600">{index + 1}</div>
              <div className="col-1p7 fw-500 d-flex-col ai-c gap-4">
                <div>{account.fullName}</div>
                <div>{account.email}</div>
              </div>
              <div className="flex-1 d-flex jc-c">
                <img
                  src={account.avatar?.url || '/default-avatar.png'}
                  alt={''}
                  className="avatar"
                />
              </div>
              <div className="col-1p7 d-flex-col ai-c">{formatFullTime(account.createdAt)}</div>
              <div className="col-1p7 d-flex-col ai-c fw-700">{account.postCount}</div>
              <div className="col-1p7 d-flex-col ai-c">
                <AppBadge tone={account.isActive ? 'success' : 'disabled'} nowrap={true}>
                  {account.isActive ? 'Hoạt động' : 'Khóa'}
                </AppBadge>
              </div>
              <div className="col-1p7 d-flex-col ai-c fw-700">{upperFirst(account.role)}</div>
              <div className="col-1p7 d-flex gap-8 jc-e">
                <div className="d-flex-col ai-e gap-8">
                  <AppButton
                    type="no-text-1"
                    icon={IconKey}
                    onClick={() => openChangePasswordModal(account)}
                    loading={editing}
                  />
                </div>
                <div className="d-flex-col ai-e gap-8">
                  <AppButton
                    type="no-text-1"
                    icon={IconEdit}
                    onClick={() => openModal(account)}
                    loading={editing}
                  />
                  <AppButton
                    type="no-text-1"
                    icon={account.isActive ? IconLock : IconUnlock}
                    loading={editing}
                    onClick={() => confirmDisableUser(account)}
                  />
                </div>
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

export default Accounts;
