import {LIMIT} from '../../const/untils.mjs';
import {convertSort} from '../../helpers/untils.mjs';
import {Types} from 'mongoose';

export default class BaseReadOnlyRepository {
  constructor(MongooseModel) {
    this.MongooseModel = MongooseModel;
  }

  getNewId = () => new Types.ObjectId();

  /**
   * @param page
   * @param limit
   * @return {Promise<{docs: Base[], count: number}>}
   */
  getList = async (page = 0, limit = LIMIT) => {
    const resp = await this.MongooseModel.aggregate([
      {$match: {}},
      {$sort: {createdAt: -1}},
      {
        $facet: {
          edges: [{$skip: page * limit}, {$limit: limit}],
          pageInfo: [{$group: {_id: null, count: {$sum: 1}}}],
        },
      },
    ]);
    return {docs: resp[0].edges, count: resp[0]?.pageInfo[0]?.count};
  };

  /**
   * @param id
   * @return {Base}
   */
  findOne = (id) => {
    return this.MongooseModel.findById(id);
  };

  findOnePopulate = (id, populate = '') => {
    return this.MongooseModel.findById(id).populate(populate);
  };

  findMany = (ids) => {
    return this.MongooseModel.find({_id: {$in: ids}}).sort({createdAt: -1});
  };

  /**
   * @param filter {Object}
   * @param populate {String}
   * @return {Promise<Base>}
   */
  findOneFilter = async ({populate = '', ...filter} = {}) => {
    return populate
      ? this.MongooseModel.findOne({filter}).populate(populate)
      : this.MongooseModel.findOne({filter});
  };

  /**
   * @param field {string} like "userId|1111111111"
   * @param populate
   * @param page
   * @param sort {'desc' | 'asc'}
   * @param limit
   * @return {Promise<{docs: Base[], count: number}>}
   */
  findManyByField = async ({field = '', populate = '', page = 0, sort = 'desc', limit = LIMIT}) => {
    const [key, value] = field.split(':');

    const [docs, count] = await Promise.all([
      this.MongooseModel.find({[key]: value})
        .sort({createdAt: convertSort(sort)})
        .populate(populate)
        .skip(page * limit)
        .limit(limit),
      this.MongooseModel.countDocuments({[key]: value}),
    ]);

    return {docs, count};
  };

  findManyPopulate = (ids, populate = '') => {
    return this.MongooseModel.find({_id: {$in: ids}})
      .sort({createdAt: -1})
      .populate(populate)
      .limit(LIMIT);
  };

  findFilter = (filter = {}) => {
    return this.MongooseModel.find(filter).sort({createdAt: -1});
  };
  getAll = () => {
    return this.MongooseModel.find({}).sort({createdAt: -1});
  };

  getModelName = () => {
    return this.MongooseModel.collection.collectionName;
  };

  queryOne = async ({type = '', userId = '', postId = ''}) => {
    const matchCondition = {};

    if (type) {
      matchCondition.type = type;
    }
    if (userId) {
      matchCondition.userId = new Types.ObjectId(userId);
    }
    if (postId) {
      matchCondition.postId = new Types.ObjectId(postId);
    }

    return this.MongooseModel.findOne(matchCondition);
  };

  /**
   * @param page
   * @param isLookupUser
   * @param localFieldUser
   * @param type
   * @param userId
   * @param limit
   * @param sortBy
   * @param sortOrder
   * @param isCompleted
   * @param isAdminHidden
   * @param postId
   * @return {Promise<{docs: Base[], count: number}>}
   */
  query = async ({
    page = 0,
    isLookupUser = false,
    localFieldUser = 'userId',
    type = '',
    userId = '',
    limit = LIMIT,
    sortBy = 'createdAt',
    sortOrder = -1,
    isCompleted = null,
    isAdminHidden = null,
    postId = '',
  }) => {
    const matchCondition = {};
    const lookupItems = [];

    if (type) {
      matchCondition.type = type;
    }
    if (userId) {
      matchCondition.userId = new Types.ObjectId(userId);
    }
    if (postId) {
      matchCondition.postId = new Types.ObjectId(postId);
    }
    if (typeof isCompleted === 'boolean') {
      matchCondition.isCompleted = isCompleted;
    }
    if (typeof isAdminHidden === 'boolean') {
      matchCondition.isCompleted = isCompleted;
    }
    if (isLookupUser) {
      lookupItems.push({
        $lookup: {
          from: 'users',
          localField: localFieldUser,
          foreignField: '_id',
          as: 'user',
        },
      });
      lookupItems.push({$unwind: '$user'});
    }

    const resp = await this.MongooseModel.aggregate(
      [
        {
          $match: matchCondition,
        },
        ...lookupItems,
        {
          $sort: {[sortBy]: sortOrder},
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
