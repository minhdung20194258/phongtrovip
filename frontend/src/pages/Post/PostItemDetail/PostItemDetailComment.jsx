import {useState} from 'react';
import {AppInput, AppSeperateText} from '@/components/index.jsx';
import {useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import {IconReply, IconSend, IconTime} from '@/components/Icons/AppIcon.jsx';
import {useParams} from 'react-router-dom';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import moment from 'moment/moment.js';
import AppInfiniteScroll from '@/components/InfiniteScroll/AppInfiniteScroll.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import * as PropTypes from 'prop-types';
import PostItemDetailInput from '@/pages/Post/PostItemDetail/PostItemDetailInput.jsx';

PostItemDetailComment.propTypes = {};

function PostItemDetailComment() {
  const [comment, setComment] = useState('');
  const params = useParams();

  const {data, reFresh, pageInfo, count, nextPage} = usePaginate({
    url: `/comments/posts/${params.postId}`,
    defaultData: [],
    keepPreviousData: true,
  });

  const {handleCreate} = useCreateApi({
    url: '/comments',
    useToast: false,
  });

  const handleCreateComment = async () => {
    if (!comment.trim()) return;
    await handleCreate({
      postId: params.postId,
      content: comment.trim(),
    });
    setComment('');
    reFresh();
  };

  return (
    <AppInfiniteScroll
      className="App-PostItemReaction"
      fetchMore={() => nextPage()}
      hasMore={pageInfo.hasNext}
      endMessage={'Bạn đang ở cuối trang'}
    >
      <div className="PostItemReaction__Header d-flex jc-sb mb-16">
        <div className="fs-16 fw-700">{`${count} bình luận`}</div>
        <div>Sắp xếp</div>
      </div>
      <PostItemDetailInput
        value={comment}
        setValue={setComment}
        handleChange={handleCreateComment}
        className="mb-16"
      />
      {data.map((item, index) => (
        <PostItemReactionsItem
          item={item}
          key={index}
          handleCreate={handleCreate}
          postId={params.postId}
        />
      ))}
    </AppInfiniteScroll>
  );
}

/**
 * @param comment {Comments}
 */
const PostViewComment = ({comment = {}}) => {
  return (
    <div className="PostItemReaction__Item PostItemReaction__Item--Comment">
      <img src={comment?.senderDetail.avatar?.url || '/default-avatar.png'} alt="" />
      <div className="PostItemReaction__Info">
        <div className="PostItemReaction__Info--Header">
          <div className="fw-600">{comment?.senderDetail.fullName}</div>
          <div className="d-flex w-full ai-c">
            <div className="d-flex txt-e ai-c color-grey-500">
              <IconTime className="w-16 h-16" />
              <div className="fs-11">{moment(comment.createdAt).from(new Date())}</div>
            </div>
          </div>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  );
};

/**
 * @param item {Comments}
 * @param handleCreate
 * @param postId
 */
const PostItemReactionsItem = ({item = {}, handleCreate, postId}) => {
  const [reply, setReply] = useState('');
  const [open, setOpen] = useState(false);

  const {data: replies, reFresh} = useFetchApi({
    url: `/comments/query?field=parentId:${item._id}&populate=senderId`,
    defaultData: [],
    initLoad: false,
  });

  const handleReplyComment = async () => {
    if (!reply.trim()) return;
    await handleCreate({
      parentId: item._id,
      content: reply,
      postId,
    });
    setReply('');
    reFresh();
  };

  return (
    <div>
      <PostViewComment comment={item} />
      <div className="pl-60">
        <div className="d-flex w-full jc-sb">
          <div className="fw-700 pointer fs-12" onClick={() => reFresh()}>
            {item.repliesSize && !replies.length ? `Xem thêm ${item.repliesSize} trả lời` : ''}
          </div>
          <div className="d-flex color-grey-500 pointer" onClick={() => setOpen((prev) => !prev)}>
            <IconReply className="w-16 h-16" />
            <div>Trả lời</div>
          </div>
        </div>
        {replies.map(({senderId: senderDetail, ...reply}, index) => (
          <div key={index}>
            <div className="PostItemReaction__Item PostItemReaction__Item--Reply" key={index}>
              <img src={senderDetail.avatar?.url || '/default-avatar.png'} alt="" />
              <div className="PostItemReaction__Info">
                <div className="PostItemReaction__Info--Header">
                  <div className="fw-600">{senderDetail.fullName}</div>
                  <div className="d-flex w-full ai-c">
                    <div className="d-flex txt-e ai-c color-grey-500">
                      <IconTime className="w-16 h-16" />
                      <div className="fs-11">{moment(reply.createdAt).from(new Date())}</div>
                    </div>
                  </div>
                </div>
                <div>{reply.content}</div>
              </div>
            </div>
            <AppSeperateText className="mb-8 mt-8" />
          </div>
        ))}
        {open && (
          <PostItemDetailInput
            value={reply}
            setValue={setReply}
            handleChange={handleReplyComment}
            className="mb-24"
          />
        )}
      </div>
      <AppSeperateText className="mb-8 mt-8" />
    </div>
  );
};

PostItemReactionsItem.propTypes = {
  item: PropTypes.object,
  handleCreate: PropTypes.func,
  postId: PropTypes.string,
};

PostViewComment.propTypes = {
  comment: PropTypes.object,
};

export default PostItemDetailComment;
