import useModal from '@/hooks/modal/useModal.jsx';
import {useRef} from 'react';

useRequestsTransfersImage.propTypes = {};

function useRequestsTransfersImage({setImages = (_) => {}, handleSave = (_) => {}, images = []}) {
  const requestRef = useRef(null);
  const handleUpload = (e) => {
    const files = e.target.files;
    const newImages = Object.keys(files).map((key) => ({
      url: URL.createObjectURL(files[key]),
      file: files[key],
    }));
    setImages(newImages);
  };

  const {modal, openModal} = useModal({
    header: 'Thêm ảnh minh chứng',
    content: (
      <div className="d-flex-col gap-32">
        <input type="file" onChange={(e) => handleUpload(e)} multiple={true} />
        <div className="d-flex flex-wrap">
          {images.map((info, i) => (
            <img
              src={info.url}
              alt={''}
              style={{maxWidth: 'unset', maxHeight: 'unset'}}
              key={i}
              className="w-280 h-240"
            />
          ))}
        </div>
      </div>
    ),
    primaryAction: {
      onAction: () => handleSave(requestRef.current?._id),
    },
    secondaryAction: {
      content: '',
    },
  });

  return {
    modal,
    openModal: (request) => {
      openModal();
      requestRef.current = request;
    },
  };
}

export default useRequestsTransfersImage;
