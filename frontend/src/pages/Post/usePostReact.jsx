import {getUserId} from '@/reducers/authSlice.js';
import {useSelector} from 'react-redux';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {AppButton} from '@/components/index.jsx';
import {IconBookMark, IconDislike, IconLove} from '@/components/Icons/AppIcon.jsx';
import {getTypeReact} from 'backend/const/types/reactionPostTypes.mjs';

usePostReact.propTypes = {};

/**
 * @param setPost {function}
 * @param post {PostsExtend}
 * @return {{ButtonSavePost: (function(): *), handleToggle: ((function(*): Promise<void>)|*), ButtonDislikePost: (function(): *), ButtonLikePost: (function(): *)}}
 */
function usePostReact({setPost = (_) => {}, post = {}}) {
  const userId = useSelector(getUserId);
  const {handleEdit} = useEditApi({
    url: `/users/reaction/post/${post._id}`,
    useToast: false,
    fullResp: true,
  });

  /**
   * @param field {'isUserLikes' | 'isUserSaves' | 'isUserDislikes'}
   * @return {Promise<void>}
   */
  const handleToggle = async (field) => {
    if (!userId) return;

    const resp = await handleEdit({
      postId: post._id,
      type: getTypeReact(field),
    });

    if (resp.success) {
      setPost({...post, [field]: !post[field]});
    }
  };

  return {
    handleToggle,
    ButtonLikePost: () => (
      <div className="PostBtnReact">
        <AppButton
          title="Thích"
          className="love"
          icon={IconLove}
          type="no-text-3"
          onClick={() => handleToggle('isUserLikes')}
          isActive={post.isUserLikes}
          // disabled={disabled}
        />
        {/*{!!post.userLikes?.length && <div className="count">{post.userLikes.length}</div>}*/}
      </div>
    ),
    ButtonSavePost: () => (
      <div className="PostBtnReact">
        <AppButton
          title="Lưu"
          className="save"
          icon={IconBookMark}
          type="no-text-3"
          onClick={() => handleToggle('isUserSaves')}
          isActive={post.isUserSaves}
          // isActive={user.postSaves?.includes(post._id) || userId === post.userId}
          // disabled={disabled}
        />
        {/*{!!post.userSaves.length && <div className="count">{post.userSaves.length}</div>}*/}
      </div>
    ),
    ButtonDislikePost: () => (
      <div className="PostBtnReact">
        <AppButton
          className="dislike"
          title="Dislike"
          icon={IconDislike}
          type="no-text-3"
          onClick={() => handleToggle('isUserDislikes')}
          isActive={post.isUserDislikes}
          // isActive={user.postDislikes?.includes(post._id) || userId === post.userId}
          // disabled={disabled}
        />
        {/*{!!post.userDislikes.length && <div className="count">{post.userDislikes.length}</div>}*/}
      </div>
    ),
  };
}

export default usePostReact;
