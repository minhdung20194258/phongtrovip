import {Schema, model} from 'mongoose';
import {FileImageSchema} from './base/FileImageSchema.mjs';

const CommentsSchema = new Schema(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'comments',
      default: null,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      require: true,
    },
    content: {
      type: String,
      default: '',
    },
    image: FileImageSchema,
    video: FileImageSchema,
  },
  {timestamps: true},
);

/** @type {Model} */
export const CommentsModel = model('comments', CommentsSchema);
export default CommentsModel;
