import AppButton from '@/components/Button/AppButton';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {thunkSignIn} from '@/reducers/authSlice';
import AppInput from '@/components/Input/AppInput';
import useFetchApi from '@/hooks/api/useFetchApi';
import {setToast} from '@/reducers/layout/toastSlice.js';
import {Outlet} from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import clientApi from '@/helper/clientApi.js';
import {delay} from 'lodash';

export default function TestPage() {
  let dispatch = useDispatch();
  const [aaa, setAAA] = useState(1);
  const [password, setPassword] = useState('123456');
  const {loading, data, fetchApi} = useFetchApi({url: '/users'});
  const images = [
    {
      original: 'https://picsum.photos/id/1024/1000/600/',
      thumbnail: 'https://picsum.photos/id/1024/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1025/1000/600/',
      thumbnail: 'https://picsum.photos/id/1025/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1026/1000/600/',
      thumbnail: 'https://picsum.photos/id/1026/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1027/1000/600/',
      thumbnail: 'https://picsum.photos/id/1027/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1029/1000/600/',
      thumbnail: 'https://picsum.photos/id/1029/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1024/1000/600/',
      thumbnail: 'https://picsum.photos/id/1024/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1025/1000/600/',
      thumbnail: 'https://picsum.photos/id/1025/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1026/1000/600/',
      thumbnail: 'https://picsum.photos/id/1026/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1027/1000/600/',
      thumbnail: 'https://picsum.photos/id/1027/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1029/1000/600/',
      thumbnail: 'https://picsum.photos/id/1029/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1025/1000/600/',
      thumbnail: 'https://picsum.photos/id/1025/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1026/1000/600/',
      thumbnail: 'https://picsum.photos/id/1026/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1027/1000/600/',
      thumbnail: 'https://picsum.photos/id/1027/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1029/1000/600/',
      thumbnail: 'https://picsum.photos/id/1029/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1024/1000/600/',
      thumbnail: 'https://picsum.photos/id/1024/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1025/1000/600/',
      thumbnail: 'https://picsum.photos/id/1025/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1026/1000/600/',
      thumbnail: 'https://picsum.photos/id/1026/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1027/1000/600/',
      thumbnail: 'https://picsum.photos/id/1027/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1029/1000/600/',
      thumbnail: 'https://picsum.photos/id/1029/250/150/',
    },
  ];

  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    const fd = new FormData();
    Object.keys(files).forEach((key) => {
      fd.append(`fileUpload${key}`, files[key]);
    });

    const url = `test/upload`;
    const resp = await clientApi.post(url, fd);
    console.log('resp', resp);
  };

  return (
    <div>
      <div style={{width: '40%'}}>
        <ImageGallery items={images} showPlayButton={false} showIndex={true} />
      </div>
      <input
        type="file"
        onChange={(e) => {
          setFiles(e.target.files);
        }}
        multiple
      />
      {/*{Object.keys(files).map((key, index) => (*/}
      {/*  <img alt={'dsf'} src={URL.createObjectURL(files[key])} key={index} />*/}
      {/*))}*/}
      <AppButton text="Upload" type="primary" onClick={() => handleUpload()} />
      <Outlet />
      {loading && <div className="loader"></div>}
      {data && data.map((inf) => <div key={inf._id}>{JSON.stringify(inf)}</div>)}
      <AppButton
        text="reFetch"
        onClick={() => {
          delay(fetchApi, 3000);
        }}
      />
      <AppInput
        value={password}
        onChange={(val) => {
          setPassword(val);
        }}
      />
      <AppButton
        onClick={() => {
          console.log(aaa);
          setAAA((prv) => prv + 1);
        }}
      >
        vadsvadsv
      </AppButton>
      <AppButton
        onClick={() =>
          dispatch({
            type: 'dialog/open',
            payload: {
              type: 'error',
              content: <div className="h-400">vsdvsadvdfbdfsb</div>,
              header: 'vdsvsdvsd',
              onAccept: () => {
                console.log(aaa);
              },
              onCancel: () => {
                console.log('onCancel', aaa);
              },
            },
          })
        }
        text="Show dialog"
      />
      <AppButton onClick={() => dispatch(setToast({content: 'vsdvsdvdsvsdvsdvsdvds'}))}>
        Show toast
      </AppButton>
      <AppButton
        onClick={() =>
          dispatch(
            thunkSignIn({
              email: 'check@gmail.com',
              password: password,
            }),
          )
        }
      >
        auth/sign-in
      </AppButton>
      <AppButton onClick={() => dispatch({type: 'auth/authSignOut'})}>Sign out</AppButton>
    </div>
  );
}
