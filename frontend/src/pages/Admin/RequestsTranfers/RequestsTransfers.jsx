import {AppContainer} from '@/components/index.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import PropTypes from 'prop-types';
import {showRequestOptions} from '@/const/options/filterOptions.js';
import {REQUEST_TRANSFER} from 'backend/const/types/requestsTypes.mjs';
import PaymentRequest from '@/pages/User/RequiredPayment/PaymentRequest.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import {useState} from 'react';
import useRequestsTransfersImage from '@/pages/Admin/RequestsTranfers/useRequestsTransfersImage.jsx';
import {pick} from 'lodash';

RequestsTransfers.propTypes = {
  isStaff: PropTypes.bool,
};

function RequestsTransfers() {
  const {data, reFreshInit, onQueriesChange, PaginateButtonGroup} = usePaginate({
    url: `/admin/requests/filter?type=${REQUEST_TRANSFER}`,
    defaultData: [],
    defaultQueries: {
      limit: 5,
      isLookupUser: true,
    },
  });
  const {data: banks} = useFetchApi({
    url: '/resource/banks',
    defaultData: [],
  });
  const {handleEdit} = useEditApi({
    url: '/admin/requests/accept',
    successCallback: () => reFreshInit(),
  });

  const {btnTabs} = useTabs({
    tabs: showRequestOptions,
    initSelected: null,
    size: 'lg',
    onTab: (id) => onQueriesChange({isCompleted: id, page: 0}),
  });
  const [images, setImages] = useState([]);

  const handleAccept = (request) => handleEdit({userId: request.userId, requestId: request._id});

  const handleSave = async (requestId) => {
    const fd = new FormData();
    images.forEach((image, i) => fd.append(`fileUpload${i}`, image.file));
    await handleEdit(fd, requestId);
  };
  const {modal, openModal} = useRequestsTransfersImage({setImages, images, handleSave});

  return (
    <AppContainer className="App-AdminContent App-AdminAccount" paddingInline={24}>
      {modal}
      <div className="AdminContent__Filter">{btnTabs}</div>
      <div className="d-flex-col gap-24">
        {data.map((request) => (
          <PaymentRequest
            key={request._id}
            bankInfo={banks.find((i) => i.id === request.bankInfo?.id)}
            request={request}
            isStaff={true}
            handleToggle={() => handleAccept(request)}
            handleUploadImage={() => openModal(request)}
          />
        ))}
        <PaginateButtonGroup isCenter={true} className="mb-24" />
      </div>
    </AppContainer>
  );
}

export default RequestsTransfers;
