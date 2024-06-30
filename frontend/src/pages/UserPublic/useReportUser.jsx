import {useEffect, useState} from 'react';
import useModal from '@/hooks/modal/useModal.jsx';
import {reportOptions} from '@/const/options/reportOptions.js';
import {AppBadge, AppInput, AppSuccessInfo} from '@/components/index.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import {useSelector} from 'react-redux';
import {getIsAuth} from '@/reducers/authSlice.js';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';

useReportUser.propTypes = {};

function useReportUser({accountId}) {
  const isAuth = useSelector(getIsAuth);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const {data, fetched, reFreshInit, setData, handleChangeData} = useFetchApi({
    url: '/reviews/check',
    initLoad: isAuth,
    defaultQueries: {},
    defaultData: {
      reasons: [],
      content: '',
      userId: accountId,
    },
  });
  const {handleCreate} = useCreateApi({
    url: '/reviews/report',
    fullResp: true,
    successCallback: () => reFreshInit(),
  });
  useEffect(() => {
    if (!fetched) return () => {};
    if (data._id) setStep(1);
  }, [fetched]);
  const handleSave = async () => {
    if (!data.reasons?.length || data._id) return;
    const resp = await handleCreate(data);
    handleChangeData('_id', resp.data?._id);
  };

  const contentStep1 = (
    <div className="d-flex-col gap-8">
      {reportOptions.map((item) => (
        <AppInput
          type="checkbox"
          key={item.value}
          label={item.title}
          value={item.value}
          onChecked={(val) =>
            setData((prev) => ({
              ...prev,
              reasons: val
                ? [...prev.reasons, item.value]
                : prev.reasons.filter((v) => v !== item.value),
            }))
          }
        />
      ))}
      {data.reasons?.includes('custom') && (
        <AppInput
          value={data.content}
          onChange={(val) => handleChangeData('content', val)}
          placeholder="Nhập lý do"
          textarea={true}
        />
      )}
      {error && (
        <AppBadge tone="error" fullWidth={true}>
          {error}
        </AppBadge>
      )}
    </div>
  );
  const contentStep2 = <AppSuccessInfo message="Bạn đã báo cáo người dùng này" size="sm" />;
  const {modal, openModal} = useModal({
    header: 'Báo cáo',
    subHeader: 'Thông tin này sẽ chỉ được chia sẻ với PHONGTROVIP.',
    primaryAction: {
      content: 'Đồng ý',
      onAction: async () => {
        if (!data.reasons?.length) return setError('Vui lòng chọn lý do');
        if (step === 0) await handleSave();
        setError('');
        setStep(1);
      },
    },
    secondaryAction: {
      content: 'Hủy',
      onAction: () => setData({}),
    },
    content: step === 0 ? contentStep1 : contentStep2,
    className: 'UserReport',
  });

  return {modal, openModal};
}

export default useReportUser;
