import {model, Schema} from 'mongoose';
import {FileImageSchema} from './base/FileImageSchema.mjs';

const RequestsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    amount: {
      type: Number,
      default: 0,
      require: true,
    },
    bankInfo: {
      type: {
        id: Number,
        accountNumber: String,
        accountName: String,
        accountCreatedAt: String,
      },
      default: {},
      require: true,
    },
    type: {
      type: String,
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isAdminFirstCheck: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [FileImageSchema],
      default: [],
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const RequestsModel = model('requests', RequestsSchema);
export default RequestsModel;
