import {WEEK, DAY, MONTH} from './times.mjs';

export const PRO = 'pro';
export const FREE = 'free';
export const ADVANCE = 'advanced';

export const plans = [
  {
    id: FREE,
    name: 'Tin thường',
    price: 2000,
    priceWeek: 2000 * 7 * 0.95,
    priceMonth: 2000 * 30 * 0.9,
    title:
      'Phù hợp tất cả các loại hình tuy nhiên lượng tiếp cận khách hàng thấp hơn do kém nổi bật hơn so với tin Pro và Advance',
    features: ['Tiếp cận khách hàng khá tốt', 'Xuất hiện sau loại tin Vip'],
  },
  {
    id: PRO,
    price: 5000,
    priceWeek: 5000 * 7 * 0.95,
    priceMonth: 5000 * 30 * 0.9,
    name: 'Tin Vip',
    title:
      'Phù hợp với khách hàng cá nhân/môi giới có lượng căn trống thường xuyên, cần cho thuê nhanh',
    features: [
      'Lượt xem nhiều gấp 3 lần tin thường',
      'Tiếp cận khách hàng tốt',
      'Xuất hiện trước tin thường',
      'Xuất hiện sau tin nâng cao',
      'Xuất hiện ở mục tin nổi bật xuyên suốt khu vực chuyên mục',
    ],
  },
  {
    id: ADVANCE,
    name: 'Tin nâng cao',
    price: 8000,
    priceWeek: 8000 * 7 * 0.95,
    priceMonth: 8000 * 30 * 0.9,
    title:
      'Phù hợp với khách hàng là công ty/cá  nhân sở hữu hệ thống lớn có từ 15-20 chỗ ở trở lên hoặc phòng trống quá lâu, thường xuyên cần cho thuê gấp',
    features: [
      'Lượt xem nhiều gấp 10 lần tin thường',
      'Ưu việt, tiếp cận tối đa khách hàng',
      'Xuất hiện ở vị trí đầu tiên ở trang chủ',
      'Đứng trên các loại tin thường và Vip',
      'Xuất hiện ở đầu tiên mục tin nổi bật xuyên suốt khu vực chuyên mục',
    ],
  },
];

export const getPricePlan = (id, interval) => {
  const plan = plans.find((item) => item.id === id) || {};

  switch (interval) {
    case DAY:
      return plan.price;
    case WEEK:
      return plan.priceWeek;
    case MONTH:
      return plan.priceMonth;
    default:
      return plan.price;
  }
};

/**
 * @param post {Posts}
 * @return {number}
 */
export const getPricePost = (post = {}) =>
  getPricePlan(post.plan, post.timeOption) * parseInt(post.timePosted + '');

export const getPlan = (id) => plans.find((item) => item.id === id) || {};

export const isFree = (id) => id === FREE;
export const isPro = (id) => id === PRO;
export const isAdvance = (id) => id === ADVANCE;
