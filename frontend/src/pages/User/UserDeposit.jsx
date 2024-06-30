import {AppCard, AppSeperateText, AppSettingToggle} from '@/components/index.jsx';
import {formatDDMMYYYY} from '@/helper/format/formatTime.js';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import {typeDepositOptions} from '@/const/options/filterOptions.js';

UserDeposit.propTypes = {};

function UserDeposit() {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const {data, loading, nextPage, pageInfo, prevPage, reFreshInit, resetQueries} = usePaginate({
    url: '/posts/deposit/list',
    defaultQueries: {
      isLookUp: true,
    },
    initQueries: {
      isReceiver: true,
    },
    defaultData: [],
  });

  const {btnTabs, selected} = useTabs({
    tabs: typeDepositOptions,
    initSelected: 0,
    size: 'lg',
    onSelect: (select) => resetQueries({...select.query, page: 0}),
  });

  const {editing, handleEdit} = useEditApi({
    url: '/posts/refund',
    successCallback: () => reFreshInit(),
  });

  const handleConfirm = (depositId) => {
    if (user.amountBalance < 500000) {
      const errorConfig = setDialog({
        type: 'error',
        header: 'Số dư tài khoản không đủ',
        content:
          'Yêu cầu tài khoản trên 500.000đ. Vui lòng nạp thêm tiền để có thể thực hiện chức năng này',
        primaryLabel: 'Nạp thẻ',
        url: '/payments',
      });
      dispatch(errorConfig);
    }

    const confirmConfig = setDialog({
      type: 'help',
      header: 'Bạn muốn hủy cọc nhà',
      content: (
        <div className="d-flex-col gap-4">
          <p>
            Chúng tôi sẽ trừ <span className="fw-700">500.000đ</span> vào tài khoản trực tiếp của
            bạn để thực hiện chức năng này.
          </p>
          <p>
            Bạn có chắc chắn muốn thực hiện? Hành động này sẽ
            <span className="fw-700"> KHÔNG </span>được hoàn tác.
          </p>
        </div>
      ),
      onAccept: () => handleEdit({}, depositId),
    });
    dispatch(confirmConfig);
  };

  return (
    <AppCard
      className="d-flex-col gap-24"
      initLoading={loading}
      header={btnTabs}
      {...{nextPage, pageInfo, prevPage}}
    >
      {data.map((deposit) => (
        <div key={deposit._id} className="d-flex-col gap-4">
          <AppSettingToggle
            title={deposit.post?.title}
            checked={!deposit.isRefund}
            useToggle={!deposit.isRefund && selected === 0}
            handleToggle={() => handleConfirm(deposit._id)}
            loading={editing}
            checkedMess="Xác nhận"
            uncheckedMess="Từ chối"
          />
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p7">Mã giao dịch:</div>
            <div>{deposit._id}</div>
          </div>
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p7">Thời gian:</div>
            <p>
              <span>Từ ngày </span>
              <span className="fw-700">{formatDDMMYYYY(deposit.startAt)}</span>
              <span> đến ngày </span>
              <span className="fw-700">{formatDDMMYYYY(deposit.endAt)}</span>
            </p>
          </div>
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p7">Người gửi:</div>
            <div className="d-flex-col">
              <div>{deposit.sender?.fullName}</div>
              <img
                src={deposit.sender?.avatar?.url || '/default-avatar.png'}
                alt=""
                className="avatar"
              />
            </div>
          </div>
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p7">Email:</div>
            <div>{deposit.sender?.email}</div>
          </div>
          <AppSeperateText className="mt-8" />
        </div>
      ))}
    </AppCard>
  );
}

export default UserDeposit;
