import PropTypes from 'prop-types';
import './PostItem.scss';
import {IconChevronDouble, IconMap, IconStarBold, IconTime} from '@/components/Icons/AppIcon.jsx';
import {AppBadge, AppBadgeVip} from '@/components/index.jsx';
import moment from 'moment/moment.js';
import 'moment/locale/vi.js';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getStatusStar} from '@/helper/post.jsx';
import {getUserId} from '@/reducers/authSlice.js';
import {splitMoney} from '@/helper/formats.js';
import {isAdvance, isPro} from 'backend/const/plans.mjs';
import usePostReact from '@/pages/Post/usePostReact.jsx';
import {getAddressString} from 'backend/const/mongoose/areaQuery.mjs';

PostItem.propTypes = {
  post: PropTypes.object,
  setPosts: PropTypes.func,
};

function PostItem({post = {} /**@type {PostsExtend}*/, setPosts = (_) => {}}) {
  const navigate = useNavigate();
  const userId = useSelector(getUserId);
  const {ButtonSavePost, ButtonDislikePost, ButtonLikePost} = usePostReact({
    setPost: (post = {}) =>
      setPosts((prev) =>
        prev.map((prevPost) => (prevPost._id === post._id ? {...prevPost, ...post} : prevPost)),
      ),
    post,
  });

  return (
    <div
      className="App-PostItem"
      onClick={() => navigate(`/posts/${userId === post.userId ? 'edit/' : ''}${post._id}`)}
    >
      <div className="PostItem__Image">
        <img src={post.images[0]?.url} alt="" className="PostItem__Image--Main" />
        <div className="PostItem__Image--Preview">
          <img
            src={post.images[1]?.url || 'dummy-image.png'}
            alt=""
            className="PostItem__Image--Small"
          />
          <img
            src={post.images[2]?.url || 'dummy-image.png'}
            alt=""
            className="PostItem__Image--Small"
          />
          <img
            src={post.images[3]?.url || 'dummy-image.png'}
            alt=""
            className="PostItem__Image--Small"
          />
          <div className="PostItem__Image--Small More">Xem thêm</div>
        </div>
      </div>
      <div className="PostItem__Description">
        <div className="PostItem__Description--Info">
          <div className="fs-16 fw-700">{post.title}</div>
          <div className="d-flex ai-c jc-sb col-1p4">
            <div className="d-flex">
              <IconStarBold times={parseInt(post.averageRating || 5)} />
              <IconStarBold times={5 - parseInt(post.averageRating || 5)} color="#bdbdbd" />
            </div>
            <div className="fs-16 fw-700 mt-4 ml-8">
              {parseFloat(post.averageRating || 5).toFixed(2)}
            </div>
          </div>
          <div className="fw-900 fs-24">{`${splitMoney(post.price) || '2.500.000'}đ/tháng`}</div>
          <div className="fw-600 color-500 d-flex gap-4 ai-s">
            <IconMap className="fs-14" />
            <div className="fs-11">{getAddressString(post)}</div>
          </div>
          <div className="max-line-2">{post.detailAddress}</div>
          {post.houseArea && (
            <div className="d-flex gap-4 ai-c">
              Diện tích:
              <AppBadge tone="disabled">
                {post.houseArea || 20}
                <p className="d-flex ai-s">
                  m<span className="fs-7">2</span>
                </p>
              </AppBadge>
            </div>
          )}
          {(isPro(post.plan) || isAdvance(post.plan)) && (
            <AppBadge tone="info" className="d-flex gap-4">
              <IconChevronDouble />
              Nhiều người quan tâm
            </AppBadge>
          )}
          {isAdvance(post.plan) && <AppBadgeVip />}
        </div>
        <div className="PostItem__Description--Review">
          <div
            className="PostItem__Description--Preview__Reaction"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex-col txt-e mb-16">
              <div className="fw-600">{getStatusStar(post.averageRating)}</div>
              <div className="fs-12 color-grey-600">{post.countReviews || 0} lượt đánh giá</div>
            </div>
            <div className="PostItem__Description--Preview__Btn">
              <ButtonLikePost />
              <ButtonSavePost />
              <ButtonDislikePost />
            </div>
          </div>
          <div className="d-flex w-full jc-e ai-c">
            <div className="d-flex txt-e ai-c">
              <IconTime />
              <div className="fs-12 fw-700">{moment(post.createdAt).from(new Date())}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
