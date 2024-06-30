import {AppBadge, AppCard, AppSeperateText} from '@/components/index.jsx';
import {useSelector} from 'react-redux';
import {getUserId} from '@/reducers/authSlice.js';
import './styles/UserActivities.scss';
import moment from 'moment';
import {getActivityName} from '@/helper/post.jsx';
import {splitMoney} from '@/helper/formats.js';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import {NavLink} from 'react-router-dom';

UserActivities.propTypes = {};

function UserActivities() {
  const userId = useSelector(getUserId);
  const {data, loading, nextPage, pageInfo, prevPage} = usePaginate({
    url: `/activities/query?field=userId:${userId}`,
    defaultData: [],
    defaultQueries: {
      limit: 5,
    },
  });

  return (
    <AppCard
      className="d-flex-col gap-24"
      initLoading={loading}
      isEmpty={!data.length}
      {...{nextPage, pageInfo, prevPage}}
    >
      {data.map((activity) => (
        <div key={activity._id} className="App-UserActivity">
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p7">Mã giao dịch:</div>
            <div>{activity._id}</div>
          </div>
          {activity.orderId && (
            <div className="d-flex gap-4">
              <div className="fw-600 col-1p7">Đơn hàng:</div>
              <div>{activity.orderId}</div>
            </div>
          )}
          {activity.postId && (
            <div className="d-flex gap-4">
              <div className="fw-600 col-1p7">Bài đăng:</div>
              <NavLink to={`/posts/${activity.postId}`} target="_blank">
                {activity.postId}
              </NavLink>
            </div>
          )}
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p7">Thời gian:</div>
            <div>{moment(activity.createdAt).format('HH:mm [ngày] DD [tháng] MM [năm] YYYY')}</div>
          </div>
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p7">Hành động:</div>
            <div>{getActivityName(activity.type)}</div>
          </div>
          {!!activity.amount && (
            <div className="d-flex gap-4">
              <div className="fw-600 col-1p7">Số tiền:</div>
              <div className="fw-700">{splitMoney(activity.amount)}đ</div>
            </div>
          )}
          <UserActivitiesChanged info={activity.oldInfo} label="Thông tin cũ:" />
          <UserActivitiesChanged info={activity.editInfo} label="Thông tin chỉnh sửa:" />
          <UserActivitiesChanged info={activity.info} label="Thông tin giao dịch" />
          <UserActivitiesStaff staffInfo={activity.staffInfo} />
          <AppSeperateText className="mt-8" />
        </div>
      ))}
    </AppCard>
  );
}

const UserActivitiesChanged = ({info = {}, label = ''}) => {
  if (isEmpty(info)) return <></>;

  return (
    <div className="d-flex gap-4">
      <div className="fw-600 col-1p7">{label || 'Thông tin chỉnh sửa:'}</div>
      <div className="d-flex-col flex-1">
        {info?.senderId && (
          <div className="d-flex w-full">
            <div className="col-1p10">Người gửi:</div>
            <NavLink to={`/user/show/${info.senderId}`} target="_blank">
              {info.senderId}
            </NavLink>
          </div>
        )}
        {info?.depositId && (
          <div className="d-flex w-full">
            <div className="col-1p10">Mã đặt cọc:</div>
            <div>{info.depositId}</div>
          </div>
        )}
        {info?.amountBalance && (
          <div className="d-flex w-full">
            <div className="col-1p10">Số tiền:</div>
            <div className="fw-700">{splitMoney(info.amountBalance)}đ</div>
          </div>
        )}
        {info?.fullName && (
          <div className="d-flex w-full">
            <div className="col-1p10">Tên:</div>
            <div>{info.fullName}</div>
          </div>
        )}
        {info?.email && (
          <div className="d-flex w-full">
            <div className="col-1p10">Email:</div>
            <div>{info.email}</div>
          </div>
        )}
        {info?.phoneNumber && (
          <div className="d-flex w-full">
            <div className="col-1p10">Số điện thoại:</div>
            <div>{info.phoneNumber}</div>
          </div>
        )}
        {info?.description && (
          <div className="d-flex w-full">
            <div className="col-1p10">Giới thiệu:</div>
            <div>{info.description}</div>
          </div>
        )}
        {info?.address && (
          <div className="d-flex w-full">
            <div className="col-1p10">Địa chỉ:</div>
            <div>{info.address}</div>
          </div>
        )}
        {typeof info?.isAdminHidden === 'boolean' && (
          <div className="d-flex w-full">
            <div className="col-1p10">Trạng thái:</div>
            <AppBadge tone={info.isAdminHidden ? 'disabled' : 'success'}>
              {info.isAdminHidden ? 'Ẩn' : 'Hiển thị'}
            </AppBadge>
          </div>
        )}
      </div>
    </div>
  );
};

const UserActivitiesStaff = ({staffInfo = {}}) => {
  if (isEmpty(staffInfo)) return <></>;

  return (
    <div className="d-flex gap-4">
      <div className="fw-600 col-1p7">Thông tin admin:</div>
      <div className="d-flex-col flex-1">
        <div className="d-flex w-full">
          <div className="col-1p10">Id:</div>
          <div>{staffInfo._id}</div>
        </div>
        <div className="d-flex w-full">
          <div className="col-1p10">Tên:</div>
          <div className="fw-700">{staffInfo.fullName}</div>
        </div>
        <div className="d-flex w-full">
          <div className="col-1p10">Quyền:</div>
          <div>{staffInfo.role}</div>
        </div>
      </div>
    </div>
  );
};

UserActivitiesChanged.propTypes = {
  info: PropTypes.object,
  label: PropTypes.bool,
};
UserActivitiesStaff.propTypes = {
  staffInfo: PropTypes.object,
};

export default UserActivities;
