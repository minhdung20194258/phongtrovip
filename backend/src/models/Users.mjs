import {Schema, model} from 'mongoose';
import {FileImageSchema} from './base/FileImageSchema.mjs';
import {hashText} from '../helpers/bcript.mjs';

const UsersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['default', 'admin', 'staff'],
      default: 'default',
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: FileImageSchema,
    imageCover: FileImageSchema,
    phoneNumber: {
      type: String,
      default: '',
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      default: '',
    },
    oneTimePass: {
      type: {
        validation: {
          type: String,
          default: '',
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
        times: {
          type: Number,
          default: 0,
        },
      },
      default: {},
    },
    amountBalance: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {timestamps: true},
);

UsersSchema.pre('save', async function (next) {
  if (this.password) {
    this.password = await hashText(this.password);
  }
  return next();
});

// ! Fail
// UsersSchema.pre('updateOne', async function (next) {
//   if (this._update.password) {
//     this._update.password = await hashText(this._update.password);
//   }
//   return next();
// });
//
// UsersSchema.pre('updateMany', async function (next) {
//   if (this._update.password) {
//     this._update.password = await hashText(this._update.password);
//   }
//   return next();
// });

/** @type {Model} */
export const UsersModel = model('users', UsersSchema);
export default UsersModel;
