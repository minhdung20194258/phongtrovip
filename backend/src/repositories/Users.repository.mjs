import UsersModel from '../models/Users.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {LIMIT} from '../const/untils.mjs';

class UsersRepository extends BaseCrudRepository {
  constructor() {
    super(UsersModel);
  }

  /**
   * @param email {string}
   * @return {Promise<Users | null>}
   */
  findOneByEmail = (email) => {
    return UsersModel.findOne({email: email});
  };

  /**
   * @param page
   * @param limit
   * @param sortBy
   * @param sortOrder
   * @param searchText
   * @param isActive
   * @param isStaff
   * @return {Promise<{docs: Users[], count: number}>}
   */
  query = async ({
    page = 0,
    limit = LIMIT,
    sortBy = 'createdAt',
    sortOrder = -1,
    searchText = '',
    isActive = null,
    isStaff = null,
  }) => {
    const matchCondition = {};
    const addFields = {};

    if (isStaff !== null && typeof isStaff === 'boolean') {
      matchCondition.role = isStaff ? 'staff' : 'default';
    }
    if (isActive !== null && typeof isActive === 'boolean') {
      matchCondition.isActive = isActive;
    }
    if (searchText) {
      addFields.fullNameLower = {$toLower: '$fullName'};
      matchCondition['$or'] = [
        {fullNameLower: {$regex: searchText.toLowerCase()}},
        {email: {$regex: searchText.toLowerCase()}},
      ];
    }
    const removeFields = {};
    Object.keys(addFields).forEach((key) => (removeFields[key] = 0));
    const resp = await UsersModel.aggregate(
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
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'userId',
            as: 'posts',
          },
        },
        {
          $addFields: {
            postCount: {$size: '$posts'},
          },
        },
        Object.keys(addFields).length && {
          $project: {...removeFields, posts: 0},
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

export default new UsersRepository();
