import {useState} from 'react';
import StarRateActions from '@/components/StarRateActions/StarRateActions.jsx';
import {AppSeperateText} from '@/components/index.jsx';
import {IconStarBold, IconTime} from '@/components/Icons/AppIcon.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import moment from 'moment/moment.js';
import {useParams} from 'react-router-dom';
import AppInfiniteScroll from '@/components/InfiniteScroll/AppInfiniteScroll.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import PostItemDetailInput from '@/pages/Post/PostItemDetail/PostItemDetailInput.jsx';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import {REVIEW_POST} from 'backend/const/types/reviewTypes.mjs';

PostItemDetailReview.propTypes = {};

function PostItemDetailReview() {
  const [star, setStar] = useState(0);
  const [errorMess, setErrorMess] = useState('');
  const [review, setReview] = useState('');
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const params = useParams();
  const {data, reFresh, pageInfo, count, nextPage} = usePaginate({
    url: `/reviews/query?field=postId:${params.postId}&populate=writerId`,
    defaultData: [],
    keepPreviousData: true,
  });
  const {
    data: {stars, rate},
    reFresh: reFreshStars,
  } = useFetchApi({
    url: `/reviews/stars/${params.postId}`,
    defaultData: {stars: [], rate: 5},
  });
  const {data: userExistingReview, reFreshInit} = useFetchApi({
    url: '/reviews/check',
    defaultData: {
      result: false,
      type: REVIEW_POST,
    },
    defaultQueries: {
      postId: params.postId,
      type: REVIEW_POST,
    },
  });
  console.log({userExistingReview});
  const {handleCreate} = useCreateApi({
    url: '/reviews',
    successCallback: () => reFreshInit(),
  });

  const handleConfirmReview = () => {
    if (!star || !user._id) return setErrorMess('Vui lòng chọn số sao đánh giá');

    dispatch(
      setDialog({
        type: 'warning',
        header: 'Xác nhận',
        content: (
          <p>
            Bạn có muốn đánh giá bài viết này <span className="fw-700">{star}</span> sao không? Hành
            động sẽ không thể thay đổi.
          </p>
        ),
        onAccept: handleCreateReview,
      }),
    );
  };

  const handleCreateReview = async () => {
    if (!star || !user._id) return setErrorMess('Vui lòng chọn số sao đánh giá');

    setErrorMess('');
    await handleCreate({
      postId: params.postId,
      content: review,
      type: REVIEW_POST,
      star,
    });

    setReview('');
    reFresh();
    reFreshStars();
  };
  return (
    <AppInfiniteScroll
      className="App-PostItemReaction"
      fetchMore={() => nextPage()}
      hasMore={pageInfo.hasNext}
      endMessage="Bạn đang ở cuối trang"
    >
      {/*<div className="d-flex ai-c jc-sb">*/}
      {/*  <div className="fs-16 fw-700">Đã có {count} đánh giá</div>*/}
      {/*  <div className="d-flex ai-c jc-sb col-1p4">*/}
      {/*    <div className="d-flex">*/}
      {/*      <IconStarBold times={parseInt(rate)} />*/}
      {/*      <IconStarBold times={5 - parseInt(rate)} color="#bdbdbd" />*/}
      {/*    </div>*/}
      {/*    <div className="fs-16 fw-700 mt-4 ml-8">{parseFloat(rate).toFixed(2)}</div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*/!*<div>*!/*/}
      {/*/!*  {stars.map((star, i) => (*!/*/}
      {/*/!*    <div key={i + 's'} className="d-flex-col">*!/*/}
      {/*/!*      <div className="d-flex ai-c col-1p4 jc-sb">*!/*/}
      {/*/!*        <IconStarBold times={i + 1} />*!/*/}
      {/*/!*        <div className="fw-700 mt-4 fs-16">{star.count}</div>*!/*/}
      {/*/!*      </div>*!/*/}
      {/*/!*    </div>*!/*/}
      {/*/!*  ))}*!/*/}
      {/*/!*</div>*!/*/}
      <div className="fw-700 fs-16 d-flex jc-c mt-16">Viết đánh giá</div>
      <StarRateActions
        currentRate={userExistingReview.star || star}
        onClick={(val) => setStar(val)}
        showStatus={true}
        disabled={!!userExistingReview.star}
        className="mb-24"
      />
      <PostItemDetailInput
        value={userExistingReview.content || review}
        setValue={setReview}
        handleChange={handleConfirmReview}
        className="mb-16"
        errorMess={errorMess}
        helpText={userExistingReview.star ? 'Bạn đã đánh giá bài viết này' : ''}
        disabled={!!userExistingReview.star}
      />
      {data.map((review, index) => (
        <div key={index}>
          <div className="PostItemReaction__Item PostItemReaction__Item--Comment">
            <img src={review?.writerId.avatar?.url || '/default-avatar.png'} alt="" />
            <div className="PostItemReaction__Info">
              <div className="PostItemReaction__Info--Header">
                <div className="fw-600">{review?.writerId.fullName}</div>
                <div className="d-flex w-full ai-c jc-sb">
                  <div className="d-flex">
                    <IconStarBold key={index + 'y'} times={review.star} />
                    <IconStarBold key={index + 'n'} times={5 - review.star} color="#bdbdbd" />
                  </div>
                  <div className="d-flex txt-e ai-c color-grey-500">
                    <IconTime className="w-16 h-16" />
                    <div className="fs-11">{moment(review.createdAt).from(new Date())}</div>
                  </div>
                </div>
              </div>
              <div>{review.content}</div>
            </div>
          </div>
          <AppSeperateText className="mb-8 mt-8" />
        </div>
      ))}
    </AppInfiniteScroll>
  );
}

export default PostItemDetailReview;
