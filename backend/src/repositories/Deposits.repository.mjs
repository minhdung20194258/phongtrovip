import DepositsModel from '../models/Deposits.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import moment from 'moment';
import {DEPOSIT_AFTER_DAYS} from '../const/config/deposit.mjs';
import {Types} from 'mongoose';
import {depositQuery} from '../const/mongoose/depositQuery.mjs';

class DepositsRepository extends BaseCrudRepository {
  constructor() {
    super(DepositsModel);
  }

  /**
   * @return {Promise<Deposits[]>}
   */
  getDepositRefund = async () =>
    DepositsModel.find({
      createdAt: {$lt: moment().add(-DEPOSIT_AFTER_DAYS, 'days')},
      isRefund: false,
      isSenderRefund: false,
    });

  query = async ({
    postId,
    receiverId,
    senderId,
    isRefund,
    startAt,
    endAt,
    _id,
    isLookUp,
    page,
    limit,
  }) => {
    const matchCondition = {};
    const lookup = [];

    if (_id) {
      matchCondition._id = new Types.ObjectId(_id);
    }
    if (postId) {
      matchCondition.postId = new Types.ObjectId(postId);
    }
    if (receiverId) {
      matchCondition.receiverId = new Types.ObjectId(receiverId);
    }
    if (senderId) {
      matchCondition.senderId = new Types.ObjectId(senderId);
    }
    if (typeof isRefund === 'boolean') {
      matchCondition.isRefund = isRefund;
    }

    if (isLookUp) {
      lookup.push({
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender',
        },
      });
      lookup.push({
        $lookup: {
          from: 'users',
          localField: 'receiverId',
          foreignField: '_id',
          as: 'receiver',
        },
      });
      lookup.push({
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'post',
        },
      });
      lookup.push({
        $unwind: {
          path: '$post',
          preserveNullAndEmptyArrays: true,
        },
      });
      lookup.push({
        $unwind: {
          path: '$receiver',
          preserveNullAndEmptyArrays: true,
        },
      });
      lookup.push({
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: true,
        },
      });
    }

    const resp = await DepositsModel.aggregate([
      {
        $match: {
          ...matchCondition,
        },
      },
      ...depositQuery({startAt, endAt}),
      ...lookup,
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          edges: [{$skip: page * limit}, {$limit: limit}],
          pageInfo: [{$group: {_id: null, count: {$sum: 1}}}],
        },
      },
    ]);

    return {docs: resp[0].edges, count: resp[0].pageInfo[0]?.count || 0};
  };
}

export default new DepositsRepository();
