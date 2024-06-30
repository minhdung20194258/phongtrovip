import {AppCard} from '@/components/index.jsx';
import PostItem from '@/pages/Post/PostItem/PostItem.jsx';
import {useSelector} from 'react-redux';
import {getUserId} from '@/reducers/authSlice.js';
import usePaginate from '@/hooks/api/usePaginate.jsx';

UserAdminPosts.propTypes = {};

function UserAdminPosts() {
  const userId = useSelector(getUserId);
  const {data, loading, nextPage, pageInfo, prevPage} = usePaginate({
    url: '/posts/filter',
    defaultData: [],
    defaultQueries: {
      limit: 5,
      userId,
    },
  });

  return (
    <AppCard
      className="d-flex-col gap-24"
      initLoading={loading}
      isEmpty={!data.length}
      {...{nextPage, prevPage, pageInfo}}
    >
      {data.map((post) => (
        <PostItem post={post} key={post._id} />
      ))}
    </AppCard>
  );
}

export default UserAdminPosts;
