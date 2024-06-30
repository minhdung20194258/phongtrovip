import {Types} from 'mongoose';

export function getNewId() {
  return new Types.ObjectId();
}
