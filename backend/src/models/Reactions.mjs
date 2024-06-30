import {model, Schema} from 'mongoose';

const ReactionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      default: null,
    },
    type: {
      type: String,
      default: '',
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const ReactionsModel = model('reactions', ReactionsSchema);
export default ReactionsModel;
