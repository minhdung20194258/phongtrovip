export interface Base extends Users, Posts, Deposits, Comments, Reaction, Requests {
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FileImage {
  assetId?: string;
  url?: string;
  publicId?: string;
}

export interface OneTimePassword {
  validation?: number;
  createdAt?: Date;
  times?: number;
}

export interface Reaction {
  field: 'Likes' | 'Dislikes' | 'Saves';
  type: 'add' | 'remove';
  reactionId: string;
}

export interface Users {
  _id?: string;
  email?: string;
  password?: string;
  role?: 'default' | 'admin' | 'staff';
  fullName?: string;
  avatar?: FileImage;
  imageCover?: FileImage;
  phoneNumber?: string;
  authType?: 'local' | 'google' | 'facebook';
  isActive?: boolean;
  address?: string;
  oneTimePass?: OneTimePassword;
  amountBalance?: number;
  description?: number;
}

export interface PostsExtend extends Posts {
  chargePrice?: number;
  user?: Users;
  deposits?: Deposits;

  averageRating?: number;
  countReviews?: number;
  countComments?: number;
  countUserLikes?: number;
  countUserSaves?: number;
  countUserDislikes?: number;
  isUserLikes?: boolean;
  isUserSaves?: boolean;
  isUserDislikes?: boolean;
  isHasDeposit?: boolean;
}

export interface Posts {
  _id?: string;
  plan?: 'pro' | 'free' | 'advance';
  timeOption?: 'day' | 'week' | 'month' | 'year';
  timePosted?: number;
  subscriptionStartAt?: Date;
  subscriptionEndAt?: Date;
  isAutoPaying?: Boolean;
  isAdminCheck?: Boolean;
  isAdminHidden?: Boolean;
  isUserHidden?: Boolean;

  typeOfRoom?: string;
  title?: string;
  description?: string;
  price?: string;
  priceElectricity?: string;
  priceWater?: string;
  priceCar?: string;
  priceInternet?: string;
  priceCleaning?: string;
  priceElevator?: string;

  province?: string;
  district?: string;
  ward?: string;
  detailAddress?: string;
  createdAt?: string;
  videoIframe?: string;
  floor?: Number;
  roomCountInfo?: string;
  houseArea?: string;
  embedGoogleMap?: string;

  startAt?: Date;
  endAt?: Date;
  isUseDeposit?: boolean;
}

export interface Comments {
  _id?: string;
  parentId?: string;
  senderId?: string;
  senderDetail?: Object;
  repliesSize?: number;
  userId?: string;
  content?: string;
  image?: FileImage;
  video?: FileImage;
  createdAt?: string;
}

export interface Deposits {
  _id?: string;
  senderId?: string;
  receiverId?: string;
  postId?: string;
  amount?: number;
  isRefund?: boolean;
  isSenderRefund?: boolean;
  refundDate?: Date;
  senderReasons?: any[];
  startAt?: Date;
  endAt?: Date;
}

export interface PassportPayload {
  iss: string;
  role: string;
  sub: string;
  iat: number | string | Date;
  exp: number | string | Date;
}

export interface BankInfo {
  id?: number;
  accountNumber?: string;
  accountName?: string;
  accountCreatedAt?: string;
}

export interface Requests {
  userId?: string;
  amount?: number;
  bankInfo?: BankInfo;
  type?: string;
  isCompleted?: boolean;
  isAdminFirstCheck?: boolean;
  images?: FileImage[];
  createdAt?: Date;
  updatedAt?: Date;
}
