import TooltipModel from '../models/Tooltips.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {LIMIT} from '../const/untils.mjs';
import {Types} from 'mongoose';

class TooltipsRepository extends BaseCrudRepository {
  constructor() {
    super(TooltipModel);
  }

  /**
   * @param page
   * @param limit
   * @param sortBy
   * @param sortOrder
   * @param searchText
   * @param isAdminHidden
   * @param userId
   * @return {Promise<{docs: any[], count: number}>}
   */
  query = async ({
    page = 0,
    limit = LIMIT,
    sortBy = 'createdAt',
    sortOrder = -1,
    searchText = '',
    isAdminHidden = null,
    userId = '',
  }) => {
    const matchCondition = {};
    const addFields = {};

    if (isAdminHidden !== null && typeof isAdminHidden === 'boolean') {
      matchCondition.isAdminHidden = isAdminHidden;
    }
    if (userId) {
      matchCondition.userId = new Types.ObjectId(userId);
    }
    if (searchText) {
      addFields.contentLower = {$toLower: '$content'};
      addFields.titleLower = {$toLower: '$title'};
      matchCondition['$or'] = [
        {contentLower: {$regex: searchText.toLowerCase()}},
        {titleLower: {$regex: searchText.toLowerCase()}},
      ];
    }
    const removeFields = {};
    Object.keys(addFields).forEach((key) => (removeFields[key] = 0));

    const resp = await TooltipModel.aggregate(
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

export default new TooltipsRepository();
