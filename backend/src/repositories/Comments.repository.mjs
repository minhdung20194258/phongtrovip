import CommentsModel from '../models/Comments.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {Types} from 'mongoose';
import {LIMIT} from '../const/untils.mjs';

class CommentsRepository extends BaseCrudRepository {
  constructor() {
    super(CommentsModel);
  }

  getByPostId = async ({postId, page}) => {
    const resp = await CommentsModel.aggregate([
      {
        $match: {
          parentId: null,
          postId: new Types.ObjectId(postId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          edges: [
            {$skip: page * LIMIT},
            {$limit: LIMIT},
            {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'parentId',
                as: 'replies',
              },
            },
            {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'parentId',
                as: 'replies',
              },
            },
            {
              $addFields: {
                repliesSize: {$size: '$replies'}, // Tính toán số lượng replies và thêm vào trường repliesSize
              },
            },
            {
              $lookup: {
                from: 'users', // Collection để join
                localField: 'senderId', // Trường trong messages collection
                foreignField: '_id', // Trường trong users collection
                as: 'senderDetail', // Tên của trường mới chứa thông tin user
              },
            },
            {
              $unwind: {
                path: '$senderDetail',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                replies: 0,
              },
            },
          ],
          pageInfo: [{$group: {_id: null, count: {$sum: 1}}}],
        },
      },
    ]);
    return {docs: resp[0].edges, count: resp[0].pageInfo[0]?.count || 0};
  };
}

export default new CommentsRepository();
