import {Schema, model} from 'mongoose';
import {FileImageSchema} from './base/FileImageSchema.mjs';

const MessagesSchema = new Schema(
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
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'chats',
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
export const MessagesModel = model('messages', MessagesSchema);
export default MessagesModel;
