import './UserPublic.scss';
import {AppContainer} from '@/components/index.jsx';
import UserPublicCard from '@/pages/UserPublic/UserPublicCard.jsx';
import UserPublicContent from '@/pages/UserPublic/UserPublicContent.jsx';
import {useParams} from 'react-router-dom';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';

UserPublic.propTypes = {};

function UserPublic() {
  const {userPublicId} = useParams();
  const {data} = useFetchApi({url: `/users/public/${userPublicId}`, defaultData: {}});

  return (
    <AppContainer className="App-UserPublic">
      <UserPublicCard user={data} />
      <UserPublicContent user={data} />
    </AppContainer>
  );
}

export default UserPublic;
