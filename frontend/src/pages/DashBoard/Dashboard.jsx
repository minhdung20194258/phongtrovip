import ImageGallery from 'react-image-gallery';
import getImageGallery from '@/helper/getImageGallery.js';
import './styles/DashBoard.scss';
import {AppButton, AppInput, AppSeperateText} from '@/components/index.jsx';
import {IconSearchFilled} from '@/components/Icons/AppIcon.jsx';
import {areas, typeOfRoomOptions} from '@/const/options/postOptions.js';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import PostItem from '@/pages/Post/PostItem/PostItem.jsx';
import TooltipsItem from '@/pages/Tooltips/TooltipsItem.jsx';
import useUrlParams from '@/hooks/useUrlParams.jsx';
import useKeyboard from '@/hooks/useKeyboard.jsx';
import {useNavigate} from 'react-router-dom';
import CustomerReviewItem from '@/pages/DashBoard/CustomerReviewItem/CustomerReviewItem.jsx';
import AppScrollX from '@/components/ScrollX/AppScrollX.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {setShowModalSignIn} from '@/reducers/layout/layoutSlice.js';
import {getUserId} from '@/reducers/authSlice.js';
import useReviewApp from '@/pages/DashBoard/useReviewApp.jsx';
import {REVIEW_APP} from 'backend/const/types/reviewTypes.mjs';
import {useRef} from 'react';
import useScroll from '@/hooks/useScroll.jsx';

const images = [
  {
    url: '/banner/banner1.png',
  },
  {
    url: '/banner/banner2.png',
  },
  {
    url: '/banner/banner3.png',
  },
];

function Dashboard() {
  const ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(getUserId);
  const {data: reviews} = useFetchApi({
    url: `/reviews/filter`,
    defaultData: [],
    initQueries: {
      type: REVIEW_APP,
      limit: 10,
      isShowForUser: true,
      minStar: 3,
    },
  });

  const {data: posts, setData: setPosts} = useFetchApi({
    url: '/posts/filter',
    defaultData: [],
    initQueries: {
      limit: 5,
      isShowForUser: true,
      currentUserId: userId,
    },
  });
  const {data: tooltips} = useFetchApi({
    url: '/tooltips',
    defaultData: [],
    initQueries: {
      limit: 5,
    },
  });
  const [searchText, setSearchText] = useUrlParams({
    name: 'searchText',
    defaultValue: '',
  });
  const handleSearch = () => {
    if (!searchText) return;
    navigate('/list?searchText=' + searchText);
  };
  useKeyboard({Enter: handleSearch});
  useScroll(ref);
  const {modal, openModal} = useReviewApp();

  return (
    <div className="App-DashBoard">
      <div ref={ref}></div>
      <ImageGallery
        items={getImageGallery(images)}
        showPlayButton={false}
        showIndex={false}
        showNav={false}
        showThumbnails={false}
        showFullscreenButton={false}
        showBullets={true}
        autoPlay={true}
        slideDuration={300}
      />
      <div className="DashBoard__Container Search">
        <div className="DashBoard__Container--Input">
          <AppInput
            placeholder="Chỗ ở bạn đang tìm kiếm"
            icon={() => IconSearchFilled({onClick: handleSearch})}
            value={searchText}
            onChange={(val) => setSearchText(val)}
          />
        </div>
        <AppSeperateText text="Dịch vụ cho thuê" classNameText="fw-500 color-text fs-16" />
        <div className="DashBoard__Type">
          {typeOfRoomOptions.map((i) => (
            <div key={i.value + 'typeOfRoomOptions'} className="DashBoard__TypeItem">
              <div className="circle-52 bg-50 d-center">
                {i.icon({className: 'w-36 h-36 color-700'})}
              </div>
              <div className="DashBoard__TypeItem--Info">
                <div>{i.label}</div>
                <div>1200 bài đăng</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="DashBoard__Container Background Area">
        <div className="DashBoard__Title">
          <div>Bài đăng theo khu vực</div>
        </div>
        <div className="DashBoard__Area">
          {areas.map((i, index) => (
            <div key={index + 'areas'} className="DashBoard__Area--Image">
              <img src={i.image} alt="" />
              <div>{i.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="DashBoard__Container Background">
        <div className="DashBoard__Title">
          <div>Tin đăng mới nhất</div>
        </div>
        {posts.map((post) => (
          <PostItem post={post} key={post._id} setPosts={setPosts} />
        ))}
        <div className="d-flex ai-s jc-c h-48">
          <AppButton type="text" url="/list">
            <div className="fw-700 fs-16 color-500">Xem thêm bài đăng</div>
          </AppButton>
        </div>
      </div>

      <div className="DashBoard__Container Background">
        <div className="DashBoard__Title">
          <div>Kinh nghiệm thuê chỗ ở</div>
        </div>
        {tooltips.map((tooltip) => (
          <TooltipsItem key={tooltip._id} tooltip={tooltip}></TooltipsItem>
        ))}
        <div className="d-flex ai-s jc-c h-48">
          <AppButton type="text" url="/list">
            <div className="fw-700 fs-16 color-500">Xem thêm mẹo vặt</div>
          </AppButton>
        </div>
      </div>

      <div className="DashBoard__Container CustomerReviews">
        <div className="DashBoard__Title">
          <div>Khách hàng nói gì về PHONGTROVIP</div>
        </div>
        <AppScrollX
          items={reviews.map((review, i) => (
            <CustomerReviewItem key={i} review={review} />
          ))}
        />
      </div>
      <div className="DashBoard__Container NewReview">
        <div className="fw-700 fs-20">Bạn nghĩ gì về dịch vụ chúng tôi?</div>
        <img src={'feedback.webp'} alt={''} />
        <AppButton
          onClick={() => {
            if (userId) return openModal();
            dispatch(setShowModalSignIn(true));
          }}
        >
          Nhận xét ngay
        </AppButton>
      </div>
      {modal}
    </div>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
