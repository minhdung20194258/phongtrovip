import React from 'react';
import PropTypes from 'prop-types';
import StarRateActions from '@/components/StarRateActions/StarRateActions.jsx';
import './CustomerReviewItem.scss';
import {AppCard} from '@/components/index.jsx';

CustomerReviewItem.propTypes = {};

function CustomerReviewItem({review = {}}) {
  return (
    <AppCard className="App-CustomerReviewItem" isNotShadow={true}>
      <div className="CustomerReviewItem__SenderInfo">
        <img src={review.user?.avatar?.url || 'default-avatar.png'} alt="" />
        <div>{review.user?.fullName}</div>
      </div>
      <div className="CustomerReviewItem__Info">
        <StarRateActions currentRate={review.star} disabled={true} />
        <div className="CustomerReviewItem__Mess scroll">
          {review.content ||
            `Tôi thực sự ấn tượng với trải nghiệm trên trang web bất động sản này. Giao diện trang web
          rất thân thiện và dễ sử dụng, giúp tôi dễ dàng tìm kiếm và lọc các bất động sản phù hợp
          với nhu cầu của mình. Thông tin chi tiết và rõ ràng, từ hình ảnh chất lượng cao đến mô tả
          chi tiết của từng bất động sản, làm tôi cảm thấy tự tin khi đưa ra quyết định. Đặc biệt,
          tôi đánh giá cao tính năng bản đồ tương tác, giúp tôi có cái nhìn tổng quan về vị trí của
          các bất động sản và tiện ích xung quanh. Dịch vụ hỗ trợ khách hàng cũng rất tuyệt vời,
          nhân viên luôn sẵn sàng giải đáp mọi thắc mắc của tôi một cách nhanh chóng và chuyên
          nghiệp. Nhờ trang web này, tôi đã tìm được ngôi nhà mơ ước của mình một cách dễ dàng và
          thuận lợi. Tôi chắc chắn sẽ giới thiệu trang web này cho bạn bè và người thân của mình.
          Cảm ơn các bạn đã mang đến một trải nghiệm mua bán bất động sản tuyệt vời!`}
        </div>
      </div>
    </AppCard>
  );
}

export default CustomerReviewItem;
