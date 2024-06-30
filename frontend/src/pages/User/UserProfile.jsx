import {useDispatch} from 'react-redux';
import {updateAuth} from '@/reducers/authSlice.js';
import AppCard from '@/components/Polaries/Card/AppCard.jsx';
import {IconCamera} from '@/components/Icons/AppIcon.jsx';
import {useEffect, useRef, useState} from 'react';
import useCropImage from '@/hooks/modal/useCropImage.jsx';
import convertBase64ToFile from '@/helper/convertBase64ToFile.js';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import AppInput from '@/components/Input/AppInput.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {isEqual} from 'lodash';
import {getChangedValue} from '@/helper/untils.js';
import MDEditorLite from 'react-markdown-editor-lite';
import MDEditor from '@uiw/react-md-editor';

UserProfile.propTypes = {};
function UserProfile() {
  const [avatarUrl, setAvatarUrl] = useState({});
  const dataRef = useRef();
  const dispatch = useDispatch();
  const {
    data /**@type {Users}*/,
    handleChangeData,
    setData,
    loading: initLoading,
    fetched,
  } = useFetchApi({
    url: `/users/private`,
  });
  const {editing, handleEdit} = useEditApi({
    url: `/users/update`,
  });
  const {editing: editingAvatar, handleEdit: handleEditAvatar} = useEditApi({
    url: `/users/avatar`,
  });

  const {modal, openModal} = useCropImage({
    image: avatarUrl,
    setImage: setAvatarUrl,
  });

  useEffect(() => {
    if (!fetched) return () => {};

    dataRef.current = data;
    setAvatarUrl(data.avatar?.url);
  }, [data.avatar?.url, fetched]);

  const onUploadAvatar = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;

    setAvatarUrl(URL.createObjectURL(files[0]));
    openModal();
  };

  const handleSave = async () => {
    const jobs = [];
    if (avatarUrl !== dataRef.current?.avatar?.url) {
      const fd = new FormData();
      fd.append('fileUpload', convertBase64ToFile(avatarUrl));
      jobs.push(handleEditAvatar(fd));
    }
    if (!isEqual(data, dataRef.current)) {
      jobs.push(handleEdit(getChangedValue(data, dataRef.current)));
    }
    await Promise.all(jobs);
    dataRef.current = data;
    dispatch(updateAuth(data));
  };

  return (
    <AppCard
      className="App-User__Profile"
      primaryAction={{
        onAction: () => handleSave(),
        hidden: isEqual(data, dataRef.current) && avatarUrl === dataRef.current?.avatar?.url,
      }}
      secondaryAction={{
        onAction: () => {
          setData(dataRef.current);
          setAvatarUrl(dataRef.current?.avatar?.url);
        },
        hidden: isEqual(data, dataRef.current) && avatarUrl === dataRef.current?.avatar?.url,
      }}
      initLoading={initLoading}
      loading={editing || editingAvatar}
      multiples={3}
    >
      <div className="d-flex pt-48">
        <div className="d-flex-col ai-c col-1p3">
          <div
            className="user__avatar"
            style={{
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : "url('/default-avatar.png')",
            }}
          >
            <input
              type="file"
              id="UserAvatar"
              onClick={(e) => (e.target.value = '')}
              onChange={(e) => onUploadAvatar(e)}
            />
            <label htmlFor="UserAvatar" className="User__Avatar--Action">
              <IconCamera className="w-28 h-28" />
            </label>
          </div>
          <div className="user__fullname">{data.fullName}</div>
        </div>
        <div className="pl-48 col-2p3">
          <AppInput value={data.email} label="Email" disabled={true} />
          <AppInput
            value={data.fullName}
            label="Họ và tên"
            onChange={(val) => handleChangeData('fullName', val)}
          />
          <AppInput
            value={data.address}
            label="Địa chỉ"
            onChange={(val) => handleChangeData('address', val)}
          />
          <p className="fw-600 mb-8">Giới thiệu bản thân</p>
          <MDEditorLite
            view={{html: false}}
            canView={{fullScreen: false}}
            allowPasteImage={true}
            style={{minHeight: '300px', maxHeight: '600px'}}
            renderHTML={(text) => <MDEditor.Markdown source={text} />}
            value={data.description}
            onChange={({text}) => handleChangeData('description', text)}
            // className={clsx({'bd-color-red-500': validations.description})}
          />
        </div>
      </div>
      {modal}
    </AppCard>
  );
}

export default UserProfile;
