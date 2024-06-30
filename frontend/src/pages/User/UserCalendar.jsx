import {AppBadge, AppButton, AppCard, AppSeperateText} from '@/components/index.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {useDispatch} from 'react-redux';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import {getAddressString} from 'backend/const/mongoose/areaQuery.mjs';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import {formatFullTime} from '@/helper/format/formatTime.js';
import useTabs from '@/hooks/useTabs.jsx';
import {typeDepositOptions} from '@/const/options/filterOptions.js';

UserCalendar.propTypes = {};

function UserCalendar() {
  const dispatch = useDispatch();
  const {data, loading, reFresh, prevPage, nextPage, pageInfo, resetQueries} = usePaginate({
    url: '/calendars/filter',
    defaultData: [],
    initQueries: {
      isReceiver: true,
    },
  });
  const {handleEdit, editing} = useEditApi({
    url: '/calendars',
    successCallback: () => reFresh(),
  });

  const {btnTabs, selected} = useTabs({
    tabs: typeDepositOptions,
    initSelected: 0,
    size: 'lg',
    onSelect: (select) => resetQueries({...select.query, page: 0}),
  });
  const handleConfirm = ({isAccept, email, _id}) => {
    dispatch(
      setDialog({
        type: 'info',
        content: `Bạn muốn ${isAccept ? 'đồng ý' : 'từ chối'} gặp "${email}"`,
        onAccept: () => handleEdit({isAccept}, _id),
        loading: editing,
      }),
    );
  };

  return (
    <AppCard
      className="d-flex-col gap-24"
      initLoading={loading}
      // isEmpty={!data.length}
      {...{prevPage, nextPage, pageInfo}}
    >
      {btnTabs}
      {data.map((calendar) => (
        <div className="App-UserCalendar d-flex-col gap-8" key={calendar._id}>
          <div className="d-flex">
            <div className="fw-600 col-1p7">Ngày:</div>
            <div>{formatFullTime(calendar.startAt)}</div>
          </div>
          <div className="d-flex">
            <div className="fw-600 col-1p7">Người gửi:</div>
            <div>{calendar.email}</div>
          </div>
          <div className="d-flex">
            <div className="fw-600 col-1p7">Bài đăng:</div>
            <div>{calendar.post?.title}</div>
          </div>
          <div className="d-flex">
            <div className="fw-600 col-1p7">Địa chỉ:</div>
            <div>{calendar.location || getAddressString(calendar.post)}</div>
          </div>
          <div className="d-flex">
            <div className="fw-600 col-1p7">Trạng thái:</div>
            <AppBadge tone={calendar.isAccept ? 'success' : 'disabled'}>
              {calendar.isAccept ? 'Đồng ý' : 'Từ chối'}
            </AppBadge>
          </div>
          {new Date(calendar.startAt) > new Date() && selected === 0 && (
            <div className="d-flex ai-c">
              <div className="fw-600 col-1p7 color-error">Xác nhận:</div>
              <div className="d-flex gap-8 ai-c">
                <AppButton
                  onClick={() =>
                    handleConfirm({
                      isAccept: true,
                      _id: calendar._id,
                      email: calendar.email,
                    })
                  }
                  loading={editing}
                >
                  Đồng ý
                </AppButton>
                <AppButton
                  type="secondary"
                  onClick={() =>
                    handleConfirm({
                      isAccept: false,
                      _id: calendar._id,
                      email: calendar.email,
                    })
                  }
                  loading={editing}
                >
                  Từ chối
                </AppButton>
              </div>
            </div>
          )}
          <AppSeperateText className="pt-12 pb-16" />
        </div>
      ))}
    </AppCard>
  );
}

export default UserCalendar;
