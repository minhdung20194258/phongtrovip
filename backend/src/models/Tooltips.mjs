import {Schema, model} from 'mongoose';
import {FileImageSchema} from './base/FileImageSchema.mjs';

const TooltipsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      default: null,
    },
    content: {
      type: String,
      default: '',
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    image: {
      type: FileImageSchema,
    },
    isAdminHidden: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const TooltipsModel = model('tooltips', TooltipsSchema);
export default TooltipsModel;
