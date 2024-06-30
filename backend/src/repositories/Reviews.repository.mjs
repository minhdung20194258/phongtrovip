import ReviewsModel from '../models/Reviews.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {Types} from 'mongoose';
import {REVIEW_POST} from '../const/types/reviewTypes.mjs';
import {LIMIT} from '../const/untils.mjs';

class ReviewsRepository extends BaseCrudRepository {
  constructor() {
    super(ReviewsModel);
  }

  query = async ({
    page = 0,
    limit = LIMIT,
    sortBy = 'createdAt',
    sortOrder = -1,
    userId = '',
    type,
    minStar,
    isAdminHidden,
    isShowForUser,
    isReported,
  }) => {
    const matchCondition = {};
    const addFields = {};
    const lookupItems = [];

    if (isShowForUser) {
      matchCondition.isAdminHidden = false;
    }
    if (userId) {
      matchCondition.writerId = userId;
    }
    if (type) {
      matchCondition.type = type;
    }
    if (minStar) {
      matchCondition.star = {$gte: parseInt(minStar)};
    }
    lookupItems.push({
      $lookup: {
        from: 'users',
        localField: 'writerId',
        foreignField: '_id',
        as: 'user',
      },
    });
    lookupItems.push({
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    });

    if (isReported) {
      lookupItems.push({
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'reportedUser',
        },
      });
      lookupItems.push({
        $unwind: {
          path: '$reportedUser',
          preserveNullAndEmptyArrays: true,
        },
      });
    }

    if (typeof isAdminHidden === 'boolean') {
      matchCondition.isAdminHidden = isAdminHidden;
    }

    const removeFields = {};
    Object.keys(addFields).forEach((key) => (removeFields[key] = 0));
    const resp = await ReviewsModel.aggregate(
      [
        Object.keys(addFields).length && {
          $addFields: addFields,
        },
        {
          $match: matchCondition,
        },
        {
          $sort: {[sortBy]: sortOrder},
        },
        Object.keys(addFields).length && {
          $project: removeFields,
        },
        ...lookupItems,
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

  countStar = (postId) => {
    return ReviewsModel.aggregate([
      {
        $match: {
          postId: new Types.ObjectId(postId),
          type: REVIEW_POST,
        },
      },
      {
        $group: {
          _id: '$star',
          count: {$sum: 1},
        },
      },
      {
        $sort: {_id: 1},
      },
    ]);
  };

  hasReview = async ({userId, writerId, postId, type}) => {
    const matchConditions = {};
    if (writerId) {
      matchConditions.writerId = writerId;
    }
    if (userId) {
      matchConditions.userId = userId;
    }
    if (postId) {
      matchConditions.postId = postId;
    }
    if (type) {
      matchConditions.type = type;
    }

    return ReviewsModel.findOne(matchConditions);
  };
}

export default new ReviewsRepository();
