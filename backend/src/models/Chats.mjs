import {Schema, model} from 'mongoose';

const ChatsSchema = new Schema(
  {
    userId1: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    userId2: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    lastMessage: {
      senderId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null,
      },
      content: {
        type: String || Object,
        default: '',
      },
    },
    userSeen1: {
      hasSeen: Boolean,
      time: Date,
    },
    userSeen2: {
      hasSeen: Boolean,
      time: Date,
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const ChatsModel = model('chats', ChatsSchema);
export default ChatsModel;
