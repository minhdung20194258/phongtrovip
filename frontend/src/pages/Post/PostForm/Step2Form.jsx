import {useContext, useEffect, useRef, useState} from 'react';
import {PostFormContext} from '@/pages/Post/PostForm/PostFormContext.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import clientApi from '@/helper/clientApi.js';
import {AppButton, AppCombobox, AppInput} from '@/components/index.jsx';
import {IconAdd, IconCricleInfo, IconTrash} from '@/components/Icons/AppIcon.jsx';
import {splitMoney} from '@/helper/formats.js';
import MDEditorLite from 'react-markdown-editor-lite';
import MDEditor from '@uiw/react-md-editor';
import clsx from 'clsx';
import ImageGallery from 'react-image-gallery';
import getImageGallery from '@/helper/getImageGallery.js';

Step2Form.propTypes = {};

function Step2Form() {
  const {
    handleChange,
    setInput,
    input = {} /**@type {Posts}*/,
    validations = {},
  } = useContext(PostFormContext);
  const {data: provinces, loading: loadingProvinces} = useFetchApi({
    url: '/resource/areas',
    defaultData: [],
  });

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  useEffect(() => {
    if (loadingProvinces || !input.province) return () => {};
    (async () => {
      const resp = await clientApi(`/resource/areas/province/${input.province}`);
      setDistricts(resp.data);
      setWards([]);
    })();
  }, [input.province, loadingProvinces]);
  useEffect(() => {
    if (loadingProvinces || !input.district || !input.province) return () => {};
    (async () => {
      const resp = await clientApi(
        `/resource/areas/district/${input.district}/province/${input.province}`,
      );
      setWards(resp.data);
    })();
  }, [input.district, loadingProvinces]);

  const imgGalleryRef = useRef();

  const onUploadImageGallery = (e, isAddOne = false, index = 0) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;

    setInput((prev) => {
      if (isAddOne) {
        const {images = []} = prev;
        images.splice(index, 0, {
          original: URL.createObjectURL(files[0]),
          thumbnail: URL.createObjectURL(files[0]),
          file: files[0],
        });
        return {
          ...prev,
          images: images.map((img, index) => ({...img, index})), // Admin images
        };
      }

      return {
        ...prev,
        images: Object.keys(files).map((key) => ({
          original: URL.createObjectURL(files[key]),
          thumbnail: URL.createObjectURL(files[key]),
          file: files[key],
        })),
      };
    });
  };

  const renderCustomControls = () => {
    const index = imgGalleryRef.current?.getCurrentIndex();

    return (
      <div className="d-flex">
        <AppButton
          type="no-text-2"
          icon={IconTrash}
          onClick={() =>
            setInput((prev) => ({
              ...prev,
              images: (prev.images || [])
                .filter((_, i) => i !== index)
                .map((img, index) => ({...img, index})),
            }))
          }
        />
        <input
          type="file"
          id="ContentStep2-Image__More"
          onClick={(e) => (e.target.value = '')}
          onChange={(e) => onUploadImageGallery(e, true, index)}
        />
        <label htmlFor="ContentStep2-Image__More" className="btn btn--no-text-2">
          <IconAdd className="w-24 h-24" />
        </label>
      </div>
    );
  };

  return (
    <div className="Content__Main">
      <div className="fw-700 fs-16 mb-8">Biên tập nội dung</div>
      <div className="row gap-24">
        <div className="Content__Main--Container">
          <div className="fw-700 fs-14 mb-8">
            Hình ảnh <span className="color-error">*</span>
          </div>
          <div className="d-flex ai-c mb-4">
            <IconCricleInfo />
            <p className="fw-500">
              <i>
                Tối thiểu <span className="fw-700">3</span> ảnh, tối đa{' '}
                <span className="fw-700">10</span> ảnh
              </i>
            </p>
          </div>
          {input.images?.length ? (
            <ImageGallery
              additionalClass="ContentStep2-ImageGallery"
              items={getImageGallery(input.images)}
              showPlayButton={false}
              showIndex={true}
              ref={imgGalleryRef}
              renderCustomControls={renderCustomControls}
            />
          ) : (
            <>
              <input
                type="file"
                id="ContentStep2-Image"
                onClick={(e) => (e.target.value = '')}
                onChange={(e) => onUploadImageGallery(e)}
                multiple={true}
              />
              <label
                htmlFor="ContentStep2-Image"
                className={clsx({
                  'ContentStep2-InputImage': true,
                  'bd-color-red-500': validations.images,
                })}
              >
                <img src="/dummy-image.png" alt="" className="ContentStep2-InputImage__Dummy" />
              </label>
            </>
          )}
          {validations.images && <div className="color-red-500">{validations.images}</div>}
        </div>
        <div className="Content__Main--Container">
          <div className="fw-700 fs-14 mb-8">Video</div>
          <div className="d-flex ai-c mb-4">
            <IconCricleInfo />
            <p className="fw-500">
              <i>
                Tối đa <span className="fw-700">1</span> video. Thẻ iframe youtube được nhúng vào.
              </i>
            </p>
          </div>
          <div>
            <AppInput
              textarea={true}
              className="h-full"
              value={input.videoIframe}
              onChange={(val) => handleChange('videoIframe', val)}
            />
          </div>
        </div>
      </div>
      <AppInput
        label="Tiêu đề"
        required={true}
        placeholder="VD: Cho thuê phòng trọ giá rẻ"
        onChange={(val) => handleChange('title', val)}
        value={input.title}
        errorMess={validations.title}
      />
      <AppInput
        label="Giá phòng"
        required={true}
        placeholder="VD: 3.0000.000"
        type="number"
        onChange={(val) => handleChange('price', val)}
        value={splitMoney(input.price)}
        errorMess={validations.price}
        suffix="đ/tháng"
        maxLength={14}
      />
      <div className="d-flex gap-12">
        <AppInput
          label="Diện tích"
          required={true}
          placeholder="VD: 15"
          type="number"
          onChange={(val) => handleChange('houseArea', val)}
          value={splitMoney(input.houseArea)}
          errorMess={validations.houseArea}
          suffix={
            <p className="d-flex ai-s">
              m<span className="fs-7">2</span>
            </p>
          }
          maxLength={14}
        />
        <AppInput
          label="Số phòng"
          required={true}
          placeholder="VD: 2N1K"
          onChange={(val) => handleChange('roomCountInfo', val)}
          value={splitMoney(input.roomCountInfo)}
          errorMess={validations.roomCountInfo}
        />

        <AppInput
          label="Tầng"
          required={true}
          placeholder="VD: 3"
          onChange={(val) => handleChange('floor', val)}
          value={splitMoney(input.floor)}
          errorMess={validations.floor}
        />
      </div>
      <div className="row gap-12">
        <AppCombobox
          className="col-1p3"
          options={provinces.map(({FullName, Code}) => ({
            label: FullName,
            value: Code,
          }))}
          selected={input.province}
          onSelected={(value, label) => {
            handleChange('province', value);
            handleChange('provinceName', label);
          }}
          label="Tỉnh/thành phố"
          placeholder="VD: Thành phố Hà Nội"
          required={true}
          errorMess={validations.province}
        />
        <AppCombobox
          className="col-1p3"
          options={districts.map(({Code, FullName}) => ({
            label: FullName,
            value: Code,
          }))}
          selected={input.district}
          onSelected={(value, label) => {
            handleChange('district', value);
            handleChange('districtName', label);
          }}
          label="Quận/huyện"
          placeholder="VD: Quận Ba Đình"
          required={true}
          errorMess={validations.district}
        />
        <AppCombobox
          className="col-1p3"
          options={wards.map(({FullName, Code}) => ({
            label: FullName,
            value: Code,
          }))}
          selected={input.ward}
          onSelected={(value, label) => {
            handleChange('ward', value);
            handleChange('wardName', label);
          }}
          label="Xã/thị trấn"
          placeholder="VD: Thành phố Hà Nội"
          required={true}
          errorMess={validations.ward}
        />
      </div>
      <AppInput
        label="Địa chỉ cụ thể"
        required={true}
        placeholder="VD: 20, ngõ 41, Ngụy Như Kon tum"
        onChange={(val) => handleChange('detailAddress', val)}
        errorMess={validations.detailAddress}
        value={input.detailAddress}
      />
      <AppInput
        label="Nhúng thẻ iframe google map"
        textarea={true}
        value={input.embedGoogleMap}
        onChange={(val) => handleChange('embedGoogleMap', val)}
        classNameInput="h-100"
      />
      <div className="row gap-12">
        <AppInput
          className="col-1p3"
          label="Giá điện"
          required={true}
          placeholder="VD: 3.0000.000"
          type="number"
          onChange={(val) => handleChange('priceElectricity', val)}
          value={splitMoney(input.priceElectricity)}
          errorMess={validations.priceElectricity}
          suffix="đ/số"
          maxLength={7}
        />
        <AppInput
          className="col-1p3"
          label="Giá nước"
          required={true}
          placeholder="VD: 3.0000.000"
          type="number"
          onChange={(val) => handleChange('priceWater', val)}
          value={splitMoney(input.priceWater)}
          errorMess={validations.priceWater}
          suffix="đ/khối"
          maxLength={7}
        />
        <AppInput
          className="col-1p3"
          label="Giá xe"
          placeholder="VD: 3.0000.000"
          type="number"
          onChange={(val) => handleChange('priceCar', val)}
          value={splitMoney(input.priceCar)}
          errorMess={validations.priceCar}
          suffix="đ/xe/tháng"
          maxLength={7}
          required={true}
        />
      </div>
      <div className="row gap-12">
        <AppInput
          className="col-1p3"
          label="Giá internet"
          placeholder="VD: 3.0000.000"
          type="number"
          onChange={(val) => handleChange('priceInternet', val)}
          value={splitMoney(input.priceInternet)}
          errorMess={validations.priceInternet}
          suffix="đ/người/tháng"
          required={true}
          maxLength={7}
        />
        <AppInput
          className="col-1p3"
          label="Giá vệ sinh"
          placeholder="VD: 3.0000.000"
          type="number"
          onChange={(val) => handleChange('priceCleaning', val)}
          value={splitMoney(input.priceCleaning)}
          errorMess={validations.priceCleaning}
          suffix="đ/người/tháng"
          required={true}
          maxLength={7}
        />
        <AppInput
          className="col-1p3"
          label="Giá thang máy"
          placeholder="VD: 3.0000.000"
          type="number"
          onChange={(val) => handleChange('priceElevator', val)}
          value={splitMoney(input.priceElevator)}
          errorMess={validations.priceElevator}
          suffix="đ/người/tháng"
          required={true}
          maxLength={7}
        />
      </div>
      <div className="pb-48">
        <p className="fw-600 mb-8">
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
          onChange={({text}) => handleChange('description', text)}
          className={clsx({'bd-color-red-500': validations.description})}
        />
        {validations.description && <div className="color-red-500">{validations.description}</div>}
      </div>
    </div>
  );
}

export default Step2Form;
