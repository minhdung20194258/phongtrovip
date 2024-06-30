import CalendarsModel from '../models/Calendars.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {Types} from 'mongoose';
import {LIMIT} from '../const/untils.mjs';

class CalendarsRepository extends BaseCrudRepository {
  constructor() {
    super(CalendarsModel);
  }

  /**
   * @param email
   * @param receiverId
   * @return {null | object}
   */
  getByEmail = async (email, receiverId) => {
    return CalendarsModel.findOne({receiverId: new Types.ObjectId(receiverId), email});
  };

  /**
   * @param page
   * @param limit
   * @param sortBy
   * @param sortOrder
   * @param searchText
   * @param receiverId
   * @param senderId
   * @return {Promise<{docs: object[], count: number}>}
   */
  query = async ({
    page = 0,
    limit = LIMIT,
    sortBy = 'createdAt',
    sortOrder = -1,
    searchText = '',
    receiverId = '',
    senderId = '',
  }) => {
    const matchCondition = {};

    if (searchText) {
      matchCondition.email = {$regex: searchText.toLowerCase()};
    }
    if (receiverId) {
      matchCondition.receiverId = new Types.ObjectId(receiverId);
    }
    if (senderId) {
      matchCondition.senderId = new Types.ObjectId(senderId);
    }
    const resp = await CalendarsModel.aggregate(
      [
        {
          $match: matchCondition,
        },
        {
          $sort: {[sortBy]: sortOrder},
        },
        {
          $lookup: {
            from: 'users',
            localField: 'receiverId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            as: 'sender',
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            as: 'post',
          },
        },
        {
          $unwind: {
            path: '$sender',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$post',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$owner',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $facet: {
            edges: [{$skip: page * limit}, {$limit: limit}],
            pageInfo: [{$group: {_id: null, count: {$sum: 1}}}],
          },
        },
      ].filter(Boolean),
    );
    return {docs: resp[0].edges, count: resp[0].pageInfo[0]?.count || 0};
  };
}

export default new CalendarsRepository();
