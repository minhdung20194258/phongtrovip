import {useCallback, useMemo, useState} from 'react';
import AppProcessBarStep from '@/components/ProcessBarStep/AppProcessBarStep.jsx';
import {PostFormContext} from '@/pages/Post/PostForm/PostFormContext.jsx';
import {
  postNewStep1Rules,
  postNewStep2Rules,
  postNewStep3Rules,
} from '@/config/validations/postValidation.js';
import Step1 from '@/pages/Post/PostForm/PostNew/Step1.jsx';
import Step2 from '@/pages/Post/PostForm/PostNew/Step2.jsx';
import Step3 from '@/pages/Post/PostForm/Step3.jsx';
import Step4 from '@/pages/Post/PostForm/Step4.jsx';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import {pick} from 'lodash';
import {postPriceItems, postStep2} from '@/helper/picker.js';
import {removeSplitObj} from '@/helper/formats.js';
import '../PostFrom.scss';
import {FREE} from 'backend/const/plans.mjs';
import {DAY} from 'backend/const/times.mjs';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

PostNew.propTypes = {};

function PostNew() {
  const [step, setStep] = useState(1);
  const {handleCreate, creating} = useCreateApi({
    url: '/posts',
    fullResp: true,
  });
  const StepInfo = useMemo(() => {
    switch (step) {
      case 1:
        return {
          Mockup: Step1,
          configRules: postNewStep1Rules,
        };
      case 2:
        return {
          Mockup: Step2,
          configRules: postNewStep2Rules,
        };
      case 3:
        return {
          Mockup: Step3,
          configRules: postNewStep3Rules,
        };

      case 4:
        return {
          Mockup: Step4,
          configRules: () => {},
        };
      default:
        return {
          Mockup: Step2,
          configRules: postNewStep1Rules,
        };
    }
  }, [step]);
  const {input, setInput, handleChange, handleValidations, validations} = useInputValidations({
    initialState: {
      plan: FREE,
      timeOption: DAY,
      timePosted: 1,
    },
    configRules: StepInfo.configRules,
  });

  const onNextStep = (value) => {
    if (value < step) return setStep(value);

    if (!handleValidations()) return;
    setStep(value);
  };

  const handleStep2To3 = async () => {
    if (!handleValidations()) return;
    if (input.firstSave) return setStep(3);

    const fd = getFormData();
    const resp = await handleCreate(fd);

    if (!resp.success) return;
    handleChange('_id', resp.data._id);
    handleChange('firstSave', true);

    setStep(3);
  };

  const getFormData = useCallback(() => {
    const fd = new FormData();
    const images = input.images || [];

    const postData = {
      ...pick(input, postStep2),
      ...removeSplitObj(pick(input, postPriceItems), '.'),
      images: images.map((image) => (image._id ? image : null)).filter(Boolean), //old image
    };
    fd.append('data', JSON.stringify(postData));
    images.forEach((image, index) => {
      if (image._id) return;
      fd.append(`fileUpload${index}`, image.file);
    });

    return fd;
  }, [input]);

  return (
    <PostFormContext.Provider
      value={{
        step,
        setStep,
        input,
        setInput,
        handleChange,
        handleValidations,
        validations,
        handleCreate,
        creating,
        handleStep2To3,
      }}
    >
      <div className="App-PostNew">
        <div className="PostForm-ProcessBar">
          <AppProcessBarStep
            step={step}
            maxSteps={4}
            message={['Chọn danh mục', 'Nội dung', 'Thanh toán', 'Hoàn thành']}
            onClickStep={onNextStep}
          />
        </div>
        <StepInfo.Mockup />
      </div>
    </PostFormContext.Provider>
  );
}

export default PostNew;
