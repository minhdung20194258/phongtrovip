import PostModel from '../models/Posts.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {LIMIT} from '../const/untils.mjs';
import {Types} from 'mongoose';
import {
  getDepositQuery,
  getPostReactionsQuery,
  postCommentQuery,
  postReviewQuery,
} from '../const/mongoose/postQuery.mjs';
import {
  USER_DISLIKE_POST,
  USER_LIKE_POST,
  USER_SAVE_POST,
} from '../const/types/reactionPostTypes.mjs';

class PostsRepository extends BaseCrudRepository {
  constructor() {
    super(PostModel);
  }

  /**
   * @param senderId
   * @param receiverId
   * @param postId
   * @param startAt
   * @param endAt
   * @param isRefund
   * @return {Promise<PostsExtend|null>}
   */
  findWithDeposit = async ({senderId, receiverId, postId, startAt, endAt, isRefund}) => {
    const matchCondition = {};
    if (postId) {
      matchCondition._id = new Types.ObjectId(postId);
    }
    if (senderId) {
      matchCondition.senderId = new Types.ObjectId(senderId);
    }
    if (receiverId) {
      matchCondition.receiverId = new Types.ObjectId(receiverId);
    }

    const posts = await PostModel.aggregate([
      {$match: matchCondition},
      ...getDepositQuery({startAt, endAt, isRefund}),
    ]);
    return posts[0] || null;
  };

  /**
   * @return {Promise<Posts[]>}
   */
  getAutoPayment = () => {
    return PostModel.aggregate([
      {
        $match: {
          isAutoPaying: true,
          $and: [
            {$or: [{subscriptionEndAt: {$exists: false}}, {subscriptionEndAt: {$lt: new Date()}}]},
            {$or: [{isAdminHidden: {$exists: false}}, {isAdminHidden: false}]},
            {$or: [{isUserHidden: {$exists: false}}, {isUserHidden: false}]},
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  };

  /**
   *
   * @param minPrice
   * @param maxPrice
   * @param provinces
   * @param districts
   * @param typeOfRooms
   * @param reviews
   * @param page
   * @param limit
   * @param sortBy
   * @param sortOrder
   * @param searchText
   * @param userId
   * @param isLookupUser
   * @param isAdminHidden
   * @param isAdmin
   * @return {Promise<{docs: any[], count: number}>}
   */
  query = async ({
    minPrice,
    maxPrice,
    provinces = [],
    districts = [],
    wards = [],
    typeOfRooms = [],
    reviews = [],
    page = 0,
    limit = LIMIT,
    sortBy = 'createdAt',
    sortOrder = -1,
    searchText = '',
    userId = '',
    isLookupUser = false,
    isAdminHidden,
    isExpired,
    isAdminCheck,
    isShowForUser,
    currentUserId,
    postId,
    isDeposit,
    isRefund,
    minArea,
    maxArea,
  }) => {
    const matchCondition = {};
    const addFields = {};
    const lookupItems = [];

    if (postId) {
      matchCondition._id = new Types.ObjectId(postId);
    }
    if (isShowForUser) {
      matchCondition.isAdminCheck = true;
      matchCondition.subscriptionEndAt = {$gt: new Date()};
      matchCondition['$and'] = [
        {$or: [{isAdminHidden: false}, {isAdminHidden: {$exists: false}}]},
        {$or: [{isUserHidden: false}, {isUserHidden: {$exists: false}}]},
      ];
    }
    if (provinces.length) {
      matchCondition.province = {$in: provinces};
    }
    if (wards.length) {
      matchCondition.ward = {$in: wards};
    }
    if (districts.length) {
      matchCondition.district = {$in: districts};
    }
    if (typeOfRooms.length) {
      matchCondition.typeOfRoom = {$in: typeOfRooms};
    }
    if (reviews.length) {
      addFields.reviewInt = {$toInt: '$review'};
      matchCondition.reviewInt = {$in: reviews};
    }
    if (userId) {
      matchCondition.userId = new Types.ObjectId(userId);
    }
    if (minPrice) {
      matchCondition.price = {$gte: minPrice};
    }
    if (maxPrice) {
      matchCondition.price = {...matchCondition.price, $lte: maxPrice};
    }
    if (minArea) {
      matchCondition.houseArea = {$gte: minArea};
    }
    if (maxArea) {
      matchCondition.houseArea = {...matchCondition.houseArea, $lte: maxArea};
    }
    if (isLookupUser) {
      lookupItems.push({
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      });
      lookupItems.push({$unwind: '$user'});
    }

    if (typeof isAdminHidden === 'boolean') {
      matchCondition.isAdminHidden = isAdminHidden;
      matchCondition.isAdminCheck = true;
    }
    if (typeof isExpired === 'boolean') {
      matchCondition.subscriptionEndAt = isExpired
        ? {subscriptionEndAt: {$lt: new Date()}}
        : {subscriptionEndAt: {$gt: new Date()}};
      matchCondition.isAdminCheck = true;
    }
    if (typeof isAdminCheck === 'boolean') {
      matchCondition.isAdminCheck = isAdminCheck;
    }
    if (searchText) {
      addFields.titleLower = {$toLower: '$title'};
      addFields.descriptionLower = {$toLower: '$description'};
      addFields.wardNameLower = {$toLower: '$wardName'};
      addFields.districtNameLower = {$toLower: '$districtName'};
      addFields.provinceNameLower = {$toLower: '$provinceName'};
      addFields.detailAddressLower = {$toLower: '$detailAddress'};
      matchCondition['$or'] = [
        ...(matchCondition['$or'] || []),
        {titleLower: {$regex: searchText.toLowerCase()}},
        {descriptionLower: {$regex: searchText.toLowerCase()}},
        {wardNameLower: {$regex: searchText.toLowerCase()}},
        {districtNameLower: {$regex: searchText.toLowerCase()}},
        {provinceNameLower: {$regex: searchText.toLowerCase()}},
        {detailAddressLower: {$regex: searchText.toLowerCase()}},
      ];
    }
    const removeFields = {};
    Object.keys(addFields).forEach((key) => (removeFields[key] = 0));
    const resp = await PostModel.aggregate(
      [
        Object.keys(addFields).length && {
          $addFields: addFields,
        },
        {
          $match: matchCondition,
        },
        ...(isDeposit ? getDepositQuery(isShowForUser ? {isRefund: false} : {isRefund}) : []),
        ...postReviewQuery,
        ...postCommentQuery,
        ...getPostReactionsQuery({
          type: USER_LIKE_POST,
          field: 'countUserLikes',
          fieldBool: 'isUserLikes',
          userId: currentUserId,
        }),
        ...getPostReactionsQuery({
          type: USER_SAVE_POST,
          field: 'countUserSaves',
          fieldBool: 'isUserSaves',
          userId: currentUserId,
        }),
        ...getPostReactionsQuery({
          type: USER_DISLIKE_POST,
          field: 'countUserDislikes',
          fieldBool: 'isUserDislikes',
          userId: currentUserId,
        }),
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
}

export default new PostsRepository();
