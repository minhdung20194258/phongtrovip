import BaseReadOnlyService from '../../services/base/BaseReadOnly.service.mjs';
import {LIMIT} from '../../const/untils.mjs';
import {convertSort} from '../../helpers/untils.mjs';

export default class BaseReadOnlyController {
  constructor(MongooseModel, Repository) {
    this._BaseReadOnlyService = new BaseReadOnlyService(MongooseModel, Repository);
  }

  query = async (req, res) => {
    const {
      isActive = null,
      isAdminHidden = null,
      sort = 'createdAt:desc',
      limit = '20',
      page = '0',
      searchText = '',
      userId = '',
      ...props
    } = req.query;
    const {count, docs, pageInfo} = await this._BaseReadOnlyService.query({
      userId,
      isAdminHidden,
      isActive,
      sortBy: sort.split(':')[0],
      sortOrder: convertSort(sort.split(':')[1]),
      limit: parseInt(limit),
      page: parseInt(page),
      searchText: searchText,
      ...props,
    });

    return res.status(200).json({
      success: true,
      data: docs,
      count,
      pageInfo,
    });
  };

  findManyByField = async (req, res) => {
    const {
      field,
      populate,
      sort,
      page = '0',
      limit = LIMIT.toString(),
      reverse = false,
    } = req.query;
    const {docs, count, pageInfo} = await this._BaseReadOnlyService.findManyByField({
      field,
      populate,
      sort,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return res.status(200).json({
      success: true,
      data: reverse ? docs.reverse() : docs,
      pageInfo,
      count,
    });
  };

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getList = async (req, res) => {
    const {page = '0', limit = LIMIT.toString()} = req.query;
    const {docs, count, pageInfo} = await this._BaseReadOnlyService.getList(
      parseInt(page),
      parseInt(limit),
    );

    return res.status(200).json({
      success: true,
      data: docs,
      pageInfo,
      count,
    });
  };

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  findOne = async (req, res) => {
    const {id} = req.params;
    if (!id) return res.status(200).json({success: false});

    const doc = await this._BaseReadOnlyService.findOne(id);

    return res.status(200).json({
      success: true,
      data: doc,
    });
  };

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  findMany = async (req, res) => {
    const {ids} = req.params;
    const doc = await this._BaseReadOnlyService.findMany(ids.split(','));

    return res.status(200).json({
      success: true,
      data: doc,
    });
  };

  findOnePopulate = async (req, res) => {
    const {id, populate = ''} = req.params;
    const doc = await this._BaseReadOnlyService.findOnePopulate(id, populate.replaceAll(',', ' '));

    return res.status(200).json({
      success: true,
      data: doc,
    });
  };
}
