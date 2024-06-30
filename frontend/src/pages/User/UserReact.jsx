import PropTypes from 'prop-types';
import {AppCard} from '@/components/index.jsx';
import PostItem from '@/pages/Post/PostItem/PostItem.jsx';
import {USER_LIKE_POST} from 'backend/const/types/reactionPostTypes.mjs';
import usePaginate from '@/hooks/api/usePaginate.jsx';

UserReact.propTypes = {
  type: PropTypes.any,
};

function UserReact({type = USER_LIKE_POST}) {
  const {data, loading, setData, pageInfo, nextPage, prevPage} = usePaginate({
    url: `/posts/react?type=${type}`,
  });

  return (
    <AppCard
      className="d-flex-col gap-24"
      initLoading={loading}
      isEmpty={!data.length}
      {...{pageInfo, nextPage, prevPage}}
    >
      {data.map((post) => (
        <PostItem post={post} key={post?._id} setPosts={setData} />
      ))}
    </AppCard>
  );
}

export default UserReact;
