import {model, Schema} from 'mongoose';

const DepositsSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      require: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    isRefund: {
      type: Boolean,
      default: false,
    },
    refundDate: {
      type: Date,
      default: null,
    },

    isSenderRefund: {
      type: Boolean,
      default: false,
    },
    senderReasons: {
      type: Array,
      default: [],
    },
    startAt: {
      type: Date,
      default: new Date(),
    },
    endAt: {
      type: Date,
      default: new Date(),
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const DepositsModel = model('deposits', DepositsSchema);
export default DepositsModel;
