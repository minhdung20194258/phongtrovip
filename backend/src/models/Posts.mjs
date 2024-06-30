import {Schema, model} from 'mongoose';
import {FileImageSchema} from './base/FileImageSchema.mjs';

const PostsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    // Payment
    plan: {
      type: String,
      enum: ['pro', 'free', 'advance'],
      default: 'free',
    },
    timeOption: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
      default: 'day',
    },
    timePosted: {
      type: Number,
      default: 1,
    },
    isAutoPaying: {
      type: Boolean,
      default: false,
    },
    subscriptionStartAt: {
      type: Date,
      default: new Date(),
    },
    subscriptionEndAt: {
      type: Date,
      default: new Date(),
    },

    //Hidden
    isAdminCheck: {
      type: Boolean,
      default: false,
    },
    isAdminHidden: {
      type: Boolean,
      default: false,
    },
    isUserHidden: {
      type: Boolean,
      default: false,
    },

    // Info
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    typeOfRoom: {
      type: String,
      required: true,
    },
    images: {
      type: [FileImageSchema],
      require: true,
    },
    videoIframe: {
      type: String,
      default: '',
    },
    floor: {
      type: Number,
      default: 1,
    },
    roomCountInfo: {
      type: String,
      default: '',
    },
    houseArea: {
      type: Number,
      default: '',
    },
    embedGoogleMap: {
      type: String,
      default: '',
    },

    // Price
    price: {
      type: Number,
      required: true,
    },
    priceElectricity: {
      type: Number,
      default: 0,
    },
    priceWater: {
      type: Number,
      default: 0,
    },
    priceCar: {
      type: Number,
      default: 0,
    },
    priceInternet: {
      type: Number,
      default: 0,
    },
    priceCleaning: {
      type: Number,
      default: 0,
    },
    priceElevator: {
      type: Number,
      default: 0,
    },

    // Address
    province: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    ward: {
      type: String,
      default: '',
    },
    detailAddress: {
      type: String,
      default: '',
    },

    // Deposit
    startAt: {
      type: Date,
      default: new Date(),
    },
    endAt: {
      type: Date,
      default: new Date(),
    },
    isUseDeposit: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const PostsModel = model('posts', PostsSchema);
export default PostsModel;
