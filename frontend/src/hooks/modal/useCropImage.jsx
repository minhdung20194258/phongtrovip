import {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import './styles/AppCropImage.scss';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import useModal from '@/hooks/modal/useModal.jsx';
import {debounce} from 'lodash';

UseCropImage.propTypes = {
  image: PropTypes.string,
  setImage: PropTypes.func,
  isClose: PropTypes.bool,
};
function UseCropImage({image = '/dummy-image.png', setImage = () => {}, isClose = true}) {
  const [imageCropURL, setImageCropURL] = useState(image);

  const cropImgEl = useCallback((node) => {
    if (node !== null) {
      const newCropper = new Cropper(node, {
        aspectRatio: 1,
        viewMode: 1,
        crop: debounce(() => {
          const squareCanvas = getRoundedCanvas(newCropper.getCroppedCanvas());
          setImageCropURL(squareCanvas.toDataURL());
        }, 1),
      });
    }
  }, []);

  function getRoundedCanvas(sourceCanvas) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const size = Math.min(sourceCanvas.width, sourceCanvas.height);

    canvas.width = size;
    canvas.height = size;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, size, size);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }

  const {modal, openModal, closeModal, open} = useModal({
    header: 'Cropping',
    primaryAction: {
      onAction: () => {
        setImage(imageCropURL);
        isClose && closeModal();
      },
    },
    className: 'crop-image',
    children: (
      <div className="crop-image__container row">
        <div className="col-3p5 d-flex ai-c">
          <img
            className="w-full"
            ref={cropImgEl}
            src={image ? image : '/dummy-image.png'}
            alt="Picture"
          />
        </div>
        <div className="w-50"></div>
        <div className="col-2p5 d-flex-col ai-c jc-c">
          <div className="h-txt-16 pb-8">Preview</div>
          <img src={imageCropURL ? imageCropURL : '/dummy-image.png'} className="w-full" alt=" " />
        </div>
      </div>
    ),
  });

  return {open, openModal, modal, closeModal};
}

export default UseCropImage;
