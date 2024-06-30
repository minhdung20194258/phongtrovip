import {useNavigate, useParams} from 'react-router-dom';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import {AppSeperateText, AppSkeleton} from '@/components/index.jsx';
import ImageGallery from 'react-image-gallery';
import getImageGallery from '@/helper/getImageGallery.js';
import './PostItemDetail.scss';
import {IconMap} from '@/components/Icons/AppIcon.jsx';
import {verifyPost} from '@/helper/post.jsx';
import PostItemDetailComment from '@/pages/Post/PostItemDetail/PostItemDetailComment.jsx';
import PostItemDetailReview from '@/pages/Post/PostItemDetail/PostItemDetailReview.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import PostItemDetailGeneral from '@/pages/Post/PostItemDetail/PostItemDetailGeneral.jsx';
import UserPublicCard from '@/pages/UserPublic/UserPublicCard.jsx';
import usePostReact from '@/pages/Post/usePostReact.jsx';
import EmbedHtml from '@/components/EmbedHtml/EmbedHtml.jsx';
import {useSelector} from 'react-redux';
import {getIsStaff, getUserId} from '@/reducers/authSlice.js';
import PostItemDetailCalendar from '@/pages/Post/PostItemDetail/PostItemDetailCalendar.jsx';
import {getAddressString} from 'backend/const/mongoose/areaQuery.mjs';

PostItemDetail.propTypes = {};

function PostItemDetail() {
  const userId = useSelector(getUserId);
  const isStaff = useSelector(getIsStaff);
  const navigate = useNavigate();
  const params = useParams();
  const {
    data: post /** @type {Posts}*/,
    loading,
    setData: setPost,
  } = useFetchApi({
    url: `/posts/filter`,
    defaultQueries: {
      isLookupUser: true,
      postId: params.postId,
      currentUserId: userId,
      isDeposit: true,
      isShowForUser: true,
    },
    presentData: (resp) => resp.data[0],
  });
  const {btnTabs, mockup} = useTabs({
    tabs: [
      {
        content: 'Giới thiệu',
        id: 0,
        mockup: <PostItemDetailGeneral post={post} />,
      },
      {
        content: 'Đánh giá',
        id: 1,
        mockup: <PostItemDetailReview post={post} />,
      },
      {
        content: 'Bình luận',
        id: 2,
        mockup: <PostItemDetailComment />,
      },
    ],
    initSelected: 0,
    size: 'lg',
  });
  const {ButtonSavePost, ButtonLikePost, ButtonDislikePost} = usePostReact({
    setPost,
    post,
  });
  const isVerified = verifyPost(post, userId);

  if (loading) return <AppSkeleton />;
  if (!isVerified && !isStaff) return navigate('/');

  return (
    <div className="App-PostItemDetail">
      <div className="PostItemDetail__Header">
        <div className="h-txt-36 mb-8 fw-700 color-grey-700">{post.title}</div>
      </div>
      <div className="PostItemDetail__Content">
        <div className="PostItemDetail__ImageGallery">
          <ImageGallery
            items={[
              post.videoIframe && {renderItem: () => <EmbedHtml iframe={post.videoIframe} />},
              ...getImageGallery(post.images),
            ].filter(Boolean)}
            showPlayButton={false}
            showIndex={true}
          />
          <div className="d-flex w-800">
            <div className="flex-1">
              <div className="fs-20 fw-700">{post.detailAddress}</div>
              <div className="h-txt-14 d-flex ai-c mb-24">
                <IconMap /> {getAddressString(post)}
              </div>
              {btnTabs}
            </div>
            <div className="d-flex-col gap-6">
              <ButtonLikePost />
              <ButtonSavePost />
              <ButtonDislikePost />
            </div>
          </div>

          <div className="h-16" />
          <div style={{minHeight: '100px'}}>{mockup}</div>
        </div>
        <div>
          <PostItemDetailCalendar post={post} isVerified={isVerified} setPost={setPost} />
          <AppSeperateText className="mt-48 mb-48" />
          <div className="d-flex-col ai-c gap-12 w-400 h-500">
            <div className="d-flex fs-20 ai-c jc-c fw-600">Gặp gỡ với chủ nhà</div>
            <UserPublicCard user={post.user} isNavigate={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItemDetail;
