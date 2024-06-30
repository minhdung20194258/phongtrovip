import {REVIEW_POST} from '../types/reviewTypes.mjs';
import {Types} from 'mongoose';

export const postReviewQuery = [
  {
    $lookup: {
      from: 'reviews',
      let: {postId: '$_id'},
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{$eq: ['$postId', '$$postId']}, {$eq: ['$type', REVIEW_POST]}],
            },
          },
        },
      ],
      as: 'reviews',
    },
  },
  {
    $unwind: {
      path: '$reviews',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: '$_id',
      post: {$first: '$$ROOT'},
      averageRating: {$avg: '$reviews.star'},
      reviewCount: {$sum: {$cond: [{$ifNull: ['$reviews._id', false]}, 1, 0]}},
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          '$post',
          {
            countReviews: '$reviewCount',
            averageRating: {$cond: [{$ifNull: ['$averageRating', false]}, '$averageRating', 0]},
          },
        ],
      },
    },
  },
  {
    $project: {
      reviews: 0,
    },
  },
];

export const postCommentQuery = [
  {
    $lookup: {
      from: 'comments',
      let: {postId: '$_id'},
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {$eq: ['$postId', '$$postId']},
                {$or: [{$eq: ['$parentId', null]}, {$eq: ['$parentId', '']}]},
              ],
            },
          },
        },
      ],
      as: 'comments',
    },
  },
  {
    $addFields: {
      countComments: {$size: '$comments'},
    },
  },
  {
    $project: {
      comments: 0,
    },
  },
];

export const getPostReactionsQuery = ({type, field, fieldBool, userId}) => {
  const userReactions = userId
    ? [
        {
          $unwind: {
            path: '$reactions',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            isReaction: {
              $eq: [new Types.ObjectId(userId), '$reactions.userId'],
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            post: {$first: '$$ROOT'},
            isTotalReaction: {
              $max: {
                $cond: {
                  if: {$eq: ['$isReaction', true]},
                  then: true,
                  else: false,
                },
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$post', {[fieldBool]: '$isTotalReaction'}],
            },
          },
        },
        {
          $project: {
            isReaction: 0,
          },
        },
      ]
    : [];

  return [
    {
      $lookup: {
        from: 'reactions',
        let: {postId: '$_id'},
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{$eq: ['$postId', '$$postId']}, {$eq: ['$type', type]}],
              },
            },
          },
        ],
        as: 'reactions',
      },
    },
    {
      $addFields: {
        [field]: {$size: '$reactions'},
      },
    },
    ...userReactions,
    {
      $project: {
        reactions: 0,
      },
    },
  ];
};

const buildLookupPipeline = ({startAt: s, endAt: e, isRefund}) => {
  const startAt = s ? new Date(s) : '$$postStartAt';
  const endAt = e ? new Date(e) : '$$postEndAt';

  const isUseRefund = typeof isRefund === 'boolean';

  return [
    {
      $match: {
        $expr: {
          $and: [
            {$eq: ['$postId', '$$postId']},
            isUseRefund && {$eq: ['$isRefund', isRefund]},
            {
              $or: [
                {
                  $and: [{$lte: ['$startAt', startAt]}, {$gte: ['$endAt', endAt]}],
                },
                {
                  $and: [
                    {$gte: ['$startAt', startAt]},
                    {$lte: ['$startAt', endAt]},
                    {$gte: ['$endAt', endAt]},
                  ],
                },
                {
                  $and: [
                    {$lte: ['$startAt', startAt]},
                    {$lte: ['$endAt', endAt]},
                    {$gte: ['$endAt', startAt]},
                  ],
                },
                {
                  $and: [
                    {$gte: ['$startAt', startAt]},
                    {$lte: ['$startAt', endAt]},
                    {$lte: ['$endAt', endAt]},
                    {$gte: ['$endAt', startAt]},
                  ],
                },
              ],
            },
          ].filter(Boolean),
        },
      },
    },
  ];
};

export const getDepositQuery = ({startAt, endAt, isRefund} = {}) => [
  {
    $lookup: {
      from: 'deposits',
      let: {postId: '$_id', postStartAt: '$startAt', postEndAt: '$endAt'},
      pipeline: buildLookupPipeline({startAt, endAt, isRefund}),
      as: 'deposits',
    },
  },
  {
    $addFields: {
      isHasDeposit: {
        $cond: {if: {$gt: [{$size: '$deposits'}, 0]}, then: true, else: false},
      },
    },
  },
  {
    $unwind: {
      path: '$deposits',
      preserveNullAndEmptyArrays: true,
    },
  },
];
