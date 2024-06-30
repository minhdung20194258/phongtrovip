import PropTypes from 'prop-types';
import {AppBadge, AppSeperateText} from '@/components/index.jsx';
import {splitMoney} from '@/helper/formats.js';
import MDEditor from '@uiw/react-md-editor';
import EmbedHtml from '@/components/EmbedHtml/EmbedHtml.jsx';

PostItemDetailGeneral.propTypes = {
  post: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

function PostItemDetailGeneral({post = {}}) {
  return (
    <>
      <div className="d-flex-col w-800 gap-8 pb-24">
        <div className="fw-700">Giá dịch vụ</div>
        <AppSeperateText />
        <div className="d-flex jc-sb pt-8 pb-8">
          <div>Giá điện: {splitMoney(post.priceElectricity)}đ</div>
          <div>Giá nước: {splitMoney(post.priceWater)}đ</div>
        </div>
        <AppSeperateText />
        <div className="d-flex jc-sb pt-8 pb-8">
          <div>Giá xe: {splitMoney(post.priceCar)}đ</div>
          <div>Giá internet: {splitMoney(post.priceInternet)}đ</div>
        </div>
        <AppSeperateText />
        <div className="d-flex jc-sb pt-8 pb-8">
          <div>Giá vệ sinh: {splitMoney(post.priceCleaning)}đ</div>
          <div>Giá vệ thang máy: {splitMoney(post.priceElevator)}đ</div>
        </div>
        <AppSeperateText />
      </div>
      <div className="d-flex-col w-800 gap-8 pb-24">
        <div className="fw-700">Chi tiết phòng</div>
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
        {post.roomCountInfo && <div>Loại phòng: {post.roomCountInfo}</div>}
        {post.floor && <div>Tầng: {post.floor}</div>}
        <AppSeperateText />
      </div>
      <MDEditor.Markdown source={post.description} />
      {post.embedGoogleMap && (
        <div className="PostItemDetail__GoogleMap">
          <EmbedHtml iframe={post.embedGoogleMap} />
        </div>
      )}
    </>
  );
}

export default PostItemDetailGeneral;
