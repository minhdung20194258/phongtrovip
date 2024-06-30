import {ADVANCE, FREE, PRO} from 'backend/const/plans.mjs';
import {DAY, MONTH, WEEK} from 'backend/const/times.mjs';
import {
  IconApartment,
  IconDoor,
  IconHomeSlim,
  IconStore,
  IconWork,
} from '@/components/Icons/AppIcon.jsx';

export const typeOfRoomOptions = [
  {
    value: 'apartment',
    label: 'Chung cư',
    icon: IconApartment,
  },
  {
    value: 'house',
    label: 'Nhà ở',
    icon: IconHomeSlim,
  },
  {
    value: 'office',
    label: 'Văn phòng',
    icon: IconWork,
  },
  {
    value: 'store',
    label: 'Mặt bằng',
    icon: IconStore,
  },

  {
    value: 'motelRoom',
    label: 'Phòng trọ',
    icon: IconDoor,
  },
];

export const planOptions = [
  {value: FREE, label: 'Tin thường'},
  {value: PRO, label: 'Tin VIP'},
  {value: ADVANCE, label: 'Tin nâng cao'},
];

export const timeOptionOptions = [
  {
    value: DAY,
    label: 'Đăng tin theo ngày',
  },
  {
    value: WEEK,
    label: 'Đăng tin theo tuần',
  },
  {
    value: MONTH,
    label: 'Đăng tin theo tháng',
  },
];

export const timePostedOptions = (frequency = DAY) => {
  const label = (() => {
    switch (frequency) {
      case DAY:
        return 'ngày';
      case WEEK:
        return 'tuần';
      case MONTH:
        return 'tháng';
      default:
        'ngày';
    }
  })();

  return [
    {value: 1, label: `1 ${label}`},
    {value: 2, label: `2 ${label}`},
    {value: 3, label: `3 ${label}`},
    {value: 4, label: `4 ${label}`},
    {value: 5, label: `5 ${label}`},
    {value: 6, label: `6 ${label}`},
    {value: 7, label: `7 ${label}`},
    {value: 8, label: `8 ${label}`},
    {value: 9, label: `9 ${label}`},
    {value: 10, label: `10 ${label}`},
  ];
};

export const postServices = [
  {label: 'Máy giặt', value: 2780},
  {label: 'TV', value: 2733},
  {label: 'Ban công/sân hiên', value: 2489},
  {label: 'Tủ lạnh', value: 2299},
  {label: 'Điều hòa', value: 1875},
  {label: 'Bếp', value: 1437},
  {label: 'Tiện nghi là/ủi', value: 1023},
  {label: 'Bể bơi riêng', value: 1035},
  {label: 'Bồn tắm', value: 844},
  {label: 'Truy cập Internet', value: 711},
  {label: 'Máy pha trà/cà phê', value: 498},
  {label: 'Sưởi', value: 353},
  {label: 'Được phép đưa thú cưng vào phòng', value: 50},
  {label: 'Tiện nghi chỗ nghỉ', value: 2342}, // Sử dụng null nếu không có giá trị cụ thể
  {label: 'Bể bơi', value: 1315},
  {label: 'Internet', value: 4065},
  {label: 'Bãi để xe', value: 3099},
  {label: 'Đưa đón sân bay', value: 1013},
  {label: 'Phòng tập', value: 1034},
  {label: 'Bàn tiếp tân [24 giờ]', value: 1540},
  {label: 'Thích hợp cho gia đình/trẻ em', value: 2072},
  {label: 'Không hút thuốc', value: 2257},
  {label: 'Spa/xông khô', value: 382},
  {label: 'Nhà hàng', value: 717},
  {label: 'Khu vực hút thuốc', value: 1418},
  {label: 'Được phép đưa thú nuôi vào', value: 848},
];

export const postSearchOptions = [
  {
    label: 'Mới nhất',
    value: 'createdAt:desc',
  },
  {
    label: 'Giá thấp trước',
    value: 'price:asc',
  },
  {
    label: 'Giá cao trước',
    value: 'price:desc',
  },
  {
    label: 'Điểm đánh giá',
    value: 'averageRating:desc',
  },
  {
    label: 'Lượt đánh giá',
    value: 'countReviews:desc',
  },
  {
    label: 'Lượt bình luận',
    value: 'countComments:desc',
  },
];

export const areas = [
  {
    label: 'Hà Nội',
    value: '01',
    image: '/hanoi.webp',
  },
  {
    label: 'TP.Hồ Chí Minh',
    value: '01',
    image: '/hcm.webp',
  },
  {
    label: 'Đà Nẵng',
    value: '01',
    image: '/danang.webp',
  },
];
