import {model, Schema} from 'mongoose';

const OtpsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    type: {
      type: String,
      default: '',
      require: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
    },
    times: {
      type: Number,
      default: 0,
    },
    validation: {
      type: String,
      default: '',
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const OtpsModel = model('otps', OtpsSchema);
export default OtpsModel;
