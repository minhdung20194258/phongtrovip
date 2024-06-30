import {Schema, model} from 'mongoose';

const ActivitiesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      default: null,
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
    amount: {
      type: Number,
      default: 0,
    },
    orderId: {
      type: String,
      default: '',
    },
    // Admin edit
    staffInfo: {
      type: Object,
      default: {},
    },
    editInfo: {
      type: Object,
      default: {},
    },
    oldInfo: {
      type: Object,
      default: {},
    },
    info: {
      type: Object,
      default: {},
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const ActivitiesModel = model('activities', ActivitiesSchema);
export default ActivitiesModel;
