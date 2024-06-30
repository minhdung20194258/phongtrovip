import {Schema, model} from 'mongoose';
import {FileImageSchema} from './base/FileImageSchema.mjs';

const ReviewsSchema = new Schema(
  {
    writerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    type: {
      type: String,
      default: '',
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      default: null,
    },
    reasons: {
      type: Array,
      default: [],
    },
    content: {
      type: String,
      default: '',
    },
    star: {
      type: Number,
      default: 0,
    },
    isAdminHidden: {
      type: Boolean,
      default: false,
    },
    image: FileImageSchema,
    video: FileImageSchema,
  },
  {timestamps: true},
);

/** @type {Model} */
export const ReviewsModel = model('reviews', ReviewsSchema);
export default ReviewsModel;
