import {Schema, model} from 'mongoose';

const CalendarsSchema = new Schema(
  {
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      require: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      // require: true,
      default: null,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      default: null,
    },
    startAt: {
      type: Date,
      default: new Date(),
    },
    timeslot: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      require: true,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    isAccept: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true},
);

/** @type {Model} */
export const CalendarsModel = model('calendars', CalendarsSchema);
export default CalendarsModel;
