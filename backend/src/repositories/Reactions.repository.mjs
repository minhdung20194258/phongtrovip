import ReactionsModel from '../models/Reactions.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {Types} from 'mongoose';
import {getPostReactionsQuery} from '../const/mongoose/postQuery.mjs';
import {
  USER_DISLIKE_POST,
  USER_LIKE_POST,
  USER_SAVE_POST,
} from '../const/types/reactionPostTypes.mjs';

class ReactionsRepository extends BaseCrudRepository {
  constructor() {
    super(ReactionsModel);
  }

  findReact = async ({postId, userId, type}) => {
    const matchCondition = {};

    if (postId) {
      matchCondition.postId = new Types.ObjectId(postId);
    }
    if (userId) {
      matchCondition.userId = new Types.ObjectId(userId);
    }
    if (type) {
      matchCondition.type = type;
    }

    return ReactionsModel.findOne(matchCondition);
  };

  query = async ({userId, type, page, limit}) => {
    const resp = await ReactionsModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          type: type,
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
          path: '$post',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$post',
        },
      },
      ...getPostReactionsQuery({
        type: USER_LIKE_POST,
        field: 'countUserLikes',
        fieldBool: 'isUserLikes',
        userId: userId,
      }),
      ...getPostReactionsQuery({
        type: USER_SAVE_POST,
        field: 'countUserSaves',
        fieldBool: 'isUserSaves',
        userId: userId,
      }),
      ...getPostReactionsQuery({
        type: USER_DISLIKE_POST,
        field: 'countUserDislikes',
        fieldBool: 'isUserDislikes',
        userId: userId,
      }),
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

export default new ReactionsRepository();
