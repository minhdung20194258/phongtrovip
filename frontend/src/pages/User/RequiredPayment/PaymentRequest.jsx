import {AppButton, AppSeperateText, AppSettingToggle} from '@/components/index.jsx';
import {splitMoney} from '@/helper/formats.js';
import {IconEdit, IconTrash, IconUpload} from '@/components/Icons/AppIcon.jsx';
import {formatFullTime} from '@/helper/format/formatTime.js';
import PropTypes from 'prop-types';

function PaymentRequest({
  request = {} /** @type {Requests} */,
  openModal = (_) => {},
  openModalDelete = (_) => {},
  bankInfo = {} /** @type {BankInfo} */,
  isStaff = false,
  handleToggle = (_) => {},
  handleUploadImage = (_) => {},
}) {
  return (
    <>
      <div className="d-flex-col gap-6">
        <AppSettingToggle
          title={`Yêu cầu rút ${splitMoney(request.amount)}đ`}
          useToggle={isStaff}
          checkedMess={'Hoàn tất'}
          uncheckedMess={'Đang chờ'}
          checked={request.isCompleted}
          handleToggle={isStaff ? handleToggle : () => {}}
        >
          {!request.isCompleted && !isStaff && (
            <div className="d-flex-col gap-12">
              <AppButton type="no-text-1" icon={IconEdit} onClick={() => openModal(request)} />
              <AppButton
                type="no-text-1"
                icon={IconTrash}
                onClick={() => openModalDelete(request._id)}
              />
            </div>
          )}
          {isStaff && (
            <AppButton type="no-text-1" icon={IconUpload} onClick={() => handleUploadImage()} />
          )}
        </AppSettingToggle>
        <div className="d-flex gap-4">
          <div className="fw-600 col-1p5">Mã giao dịch:</div>
          <div>{request._id}</div>
        </div>
        <div className="d-flex gap-4">
          <div className="fw-600 col-1p5">Ngày tạo:</div>
          <div>{formatFullTime(request.createdAt)}</div>
        </div>
        <div className="d-flex gap-4">
          <div className="fw-600 col-1p5">Ngân hàng:</div>
          <div>{bankInfo.name}</div>
        </div>
        <div className="d-flex gap-4">
          <div className="fw-600 col-1p5">Số tài khoản:</div>
          <div>{request.bankInfo?.accountNumber}</div>
        </div>
        <div className="d-flex gap-4">
          <div className="fw-600 col-1p5">Chủ tài khoản:</div>
          <div>{request.bankInfo?.accountName}</div>
        </div>
        <div className="d-flex gap-4">
          <div className="fw-600 col-1p5">Ngày tạo tài khoản:</div>
          <div>{request.bankInfo?.accountCreatedAt}</div>
        </div>
        {!!request.images?.length && (
          <div className="d-flex gap-4">
            <div className="fw-600 col-1p5">Minh chứng thành công:</div>
            <div className="d-flex gap-16">
              {request.images.map((img) => (
                <img
                  src={img.url || '/dummy-image.png'}
                  className={'w-120 h-100'}
                  alt={''}
                  key={img.url}
                  onClick={() => window.open(img.url, '_blank')}
                />
              ))}
            </div>
          </div>
        )}
        {isStaff && (
          <div>
            <div className="d-flex gap-4">
              <div className="fw-600 col-1p5">Người tạo yêu cầu:</div>
              <div>
                <div>{request.user?.fullName}</div>
                <img src={request.user?.avatar?.url} alt={'avt'} className={'avatar'} />
              </div>
            </div>
            <div className="d-flex gap-4">
              <div className="fw-600 col-1p5">Số dư hiện có:</div>
              <div className="fw-700"> {splitMoney(request.user?.amountBalance)}đ</div>
            </div>
          </div>
        )}
        <AppSeperateText className="mt-12 mb-16" />
      </div>
    </>
  );
}

PaymentRequest.propTypes = {
  request: PropTypes.object,
  bankInfo: PropTypes.object,
  openModal: PropTypes.func,
  openModalDelete: PropTypes.func,
  isStaff: PropTypes.bool,
  handleToggle: PropTypes.func,
  handleUploadImage: PropTypes.func,
};

export default PaymentRequest;
