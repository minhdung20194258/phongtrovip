import usePaginate from '@/hooks/api/usePaginate.jsx';
import {AppCard} from '@/components/index.jsx';
import usePaymentRequiredForm from '@/pages/User/RequiredPayment/usePaymentRequiredForm.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import PaymentRequest from '@/pages/User/RequiredPayment/PaymentRequest.jsx';
import useDeleteApi from '@/hooks/api/useDeleteApi.jsx';
import useModal from '@/hooks/modal/useModal.jsx';
import {useDispatch} from 'react-redux';
import {setDialog} from '@/reducers/layout/dialogSlice.js';

UserPaymentRequired.propTypes = {};

function UserPaymentRequired() {
  const dispatch = useDispatch();
  const {data, loading, nextPage, pageInfo, prevPage, reFreshInit} = usePaginate({
    url: '/users/requests',
    defaultData: [],
  });
  const {data: banks} = useFetchApi({
    url: '/resource/banks',
    defaultData: [],
  });
  const {handleDelete} = useDeleteApi({
    url: '/users/requests',
  });
  const {modal, openModal} = usePaymentRequiredForm({refresh: reFreshInit, banks});

  const openModalDelete = (id) => {
    dispatch(
      setDialog({
        header: 'Xác nhận',
        content: 'Bạn có chắc chắn muốn xóa yêu cầu này?',
        onAccept: async () => {
          const resp = await handleDelete(id);
          if (resp) reFreshInit();
        },
      }),
    );
  };

  return (
    <AppCard
      className="d-flex-col gap-24"
      initLoading={loading}
      isEmpty={!data.length}
      primaryAction={{
        content: 'Tạo mới',
        onAction: openModal,
      }}
      {...{nextPage, pageInfo, prevPage}}
    >
      {modal}
      {data.map((request) => (
        <PaymentRequest
          request={request}
          key={request._id}
          openModal={openModal}
          openModalDelete={() => openModalDelete(request._id)}
          bankInfo={banks.find((i) => i.id === request.bankInfo?.id)}
        />
      ))}
    </AppCard>
  );
}

export default UserPaymentRequired;
