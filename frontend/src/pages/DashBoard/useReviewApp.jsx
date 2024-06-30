import useModal from '@/hooks/modal/useModal.jsx';
import StarRateActions from '@/components/StarRateActions/StarRateActions.jsx';
import {AppInput} from '@/components/index.jsx';
import './styles/useReviewApp.scss';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import {useSelector} from 'react-redux';
import {getUserId} from '@/reducers/authSlice.js';
import {REVIEW_APP} from 'backend/const/types/reviewTypes.mjs';

useReviewApp.propTypes = {};

function useReviewApp() {
  const userId = useSelector(getUserId);
  const {data, handleChangeData} = useFetchApi({
    url: '/reviews/check',
    defaultQueries: {writerId: userId, type: REVIEW_APP},
    defaultData: {star: 0, content: '', type: REVIEW_APP},
    initLoad: userId,
  });
  const {handleCreate, creating} = useCreateApi({
    url: '/reviews',
    fullResp: true,
  });
  const handleSave = async () => {
    if (!data.star || data._id) return;
    const resp = await handleCreate(data);
    handleChangeData('_id', resp.data?._id);
  };

  const {modal, openModal} = useModal({
    header: data._id ? 'Cảm ơn đánh giá của bạn' : 'Đánh giá dịch vụ của PHONGTROVIP',
    className: 'App-UseReviewApp',
    content: (
      <div className="ReviewInfo">
        <StarRateActions
          currentRate={data.star || 0}
          onClick={(val) => handleChangeData('star', val)}
          showStatus={true}
          disabled={!!data._id}
        />
        <AppInput
          label="Bạn nghĩ gì về dịch vụ của chúng tôi"
          helpText={data._id ? 'Bạn đã nhận xét rồi' : ''}
          textarea={true}
          value={data.content}
          onChange={(val) => handleChangeData('content', val)}
          disabled={!!data._id}
        />
      </div>
    ),
    primaryAction: {
      content: 'Gửi',
      onAction: () => handleSave(),
    },
    secondaryAction: {
      content: 'Huỷ',
    },
    loading: creating,
  });

  return {modal, openModal};
}

export default useReviewApp;
