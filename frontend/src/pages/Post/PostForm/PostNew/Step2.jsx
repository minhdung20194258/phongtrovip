import {AppButton, AppSeperateText} from '@/components/index.jsx';
import {useContext} from 'react';
import {PostFormContext} from '@/pages/Post/PostForm/PostFormContext.jsx';
import 'react-markdown-editor-lite/lib/index.css';
import {instructions} from '@/helper/post.jsx';
import Step2Form from '@/pages/Post/PostForm/Step2Form.jsx';

Step2.propTypes = {};

function Step2() {
  const {handleStep2To3 = () => {}, creating = false} = useContext(PostFormContext);

  return (
    <div className="PostForm__ContentLayout ContentStep2">
      <div className="Content__Sidebar">
        <div className="fw-700 fs-16 mb-8">Nội dung tin đăng</div>
        <div className="fw-700 fs-16 color-500 mt-24 d-flex jc-c">Hướng dẫn đăng tin</div>
        <AppSeperateText classNameHr="bg-500 h-3 mt-12" />
        <div className="d-flex-col gap-24 mt-48">
          {instructions.map((message, index) => (
            <div key={index} className="d-flex ai-s gap-12">
              <div className="circle-8 bg-500 mt-6" />
              <div>{message}</div>
            </div>
          ))}
        </div>

        <AppButton className="mt-24" onClick={() => handleStep2To3()} loading={creating} size="lg">
          Tiếp theo
        </AppButton>
      </div>
      <Step2Form />
    </div>
  );
}

export default Step2;
