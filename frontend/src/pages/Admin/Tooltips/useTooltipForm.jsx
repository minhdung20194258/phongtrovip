import {AppInput} from '@/components/index.jsx';
import {isEmpty, pick} from 'lodash';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import {IconUpload} from '@/components/Icons/AppIcon.jsx';
import MDEditorLite from 'react-markdown-editor-lite';
import MDEditor from '@uiw/react-md-editor';
import useModal from '@/hooks/modal/useModal.jsx';
import PropTypes from 'prop-types';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

UseTooltipForm.propTypes = {
  successCallback: PropTypes.any,
};

function UseTooltipForm({successCallback = () => {}}) {
  const {input, handleChange, setInput, validations, handleValidations} = useInputValidations({
    initialState: {
      imageRaw: {},
      imageRawUrl: '',
    },
  });
  const isEditing = isEmpty(input) && input._id;
  const {handleCreate, creating} = useCreateApi({
    url: '/tooltips',
    successMsg: isEditing ? 'Tạo mới thành công' : 'Chỉnh sửa thành công',
    successCallback: successCallback,
  });
  const handleSave = async () => {
    if (!handleValidations()) return;

    const fd = new FormData();
    fd.append('data', JSON.stringify(pick(input, ['content', 'title', '_id', 'image'])));
    fd.append(`fileUpload`, input.imageRaw);
    const resp = await handleCreate(fd);
    if (!resp.success) return;
    handleChange('_id', resp.data._id);
  };

  const handleUploadFile = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;

    handleChange('imageRawUrl', URL.createObjectURL(files[0]));
    handleChange('imageRaw', files[0]);
  };

  const {modal, openModal} = useModal({
    header: isEditing ? 'Chỉnh sửa' : 'Thêm mới',
    content: (
      <div className="AdminContentForm">
        <input
          type="file"
          id="AdminContentForm-Image"
          onClick={(e) => (e.target.value = '')}
          onChange={handleUploadFile}
          multiple={false}
        />
        <label htmlFor="AdminContentForm-Image" className="d-flex gap-8 ai-c">
          <div className="fw-600">Hình ảnh</div>
          {input.image?.url || input.imageRawUrl ? (
            <img src={input.imageRawUrl || input.image?.url} alt="" />
          ) : (
            <IconUpload className="w-56 h-56 p-12 btn btn--no-text-1" />
          )}
        </label>

        <AppInput
          label="Tiêu đề"
          required={true}
          placeholder="VD: Kinh nghiệm thuê nhà"
          onChange={(val) => handleChange('title', val)}
          value={input.title}
          errorMess={validations.title}
        />
        <p className="fw-700 mb-8">
          Mô tả <span className="color-red-500 ml-4">*</span>
        </p>
        <MDEditorLite
          view={{html: false}}
          canView={{fullScreen: false}}
          allowPasteImage={true}
          placeholder="Nhập chi tiết vấn đề của bạn tại đây..."
          style={{minHeight: '300px', maxHeight: '600px'}}
          renderHTML={(text) => <MDEditor.Markdown source={text} />}
          value={input.description}
          onChange={({text}) => handleChange('content', text)}
          // className={clsx({'bd-color-red-500': validations.description})}
        />
      </div>
    ),
    primaryAction: {
      content: 'Lưu',
      onAction: () => handleSave(),
      loading: creating,
    },
    secondaryAction: {
      content: 'Huỷ',
      onAction: () => setInput({}),
      loading: creating,
    },
  });

  return {
    modal,
    openModal: (tooltip) => {
      setInput(tooltip);
      openModal();
    },
    setInput,
  };
}

export default UseTooltipForm;
