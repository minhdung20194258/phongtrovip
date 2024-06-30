import BaseReadOnlyRepository from '../../repositories/base/BaseReadOnly.repository.mjs';
import pagination from '../../helpers/pagination.mjs';

export default class BaseReadOnlyService extends BaseReadOnlyRepository {
  /**
   * @param MongooseModel {import('mongoose').Model}
   * @param Repository
   */
  constructor(MongooseModel, Repository) {
    super(MongooseModel);
    this._BaseReadOnlyRepository = new BaseReadOnlyRepository(MongooseModel);
    this.Repo = Repository;
  }

  getNewId = () => this._BaseReadOnlyRepository.getNewId();

  query = async (search = {}) => {
    const {count, docs} = await this.Repo.query(search);

    return {
      count,
      docs,
      pageInfo: pagination({count, ...search}),
    };
  };

  /**
   * @param page
   * @param limit
   * @return {Promise<{docs:any[], pageInfo: {hasPrev: boolean, hasNext: boolean}, count: number}>}
   */
  getList = async (page = 0, limit) => {
    const {docs, count} = await this._BaseReadOnlyRepository.getList(page, limit);

    return {
      docs: Array.isArray(docs) ? docs : [],
      pageInfo: pagination({count, page, limit}),
      count,
    };
  };

  /**
   * @param field
   * @param populate
   * @param page
   * @param sort
   * @param limit
   * @return {Promise<{docs:any[], pageInfo: {hasPrev: boolean, hasNext: boolean}, count: number}>}
   */
  findManyByField = async ({field, populate, page, sort, limit}) => {
    const {docs, count} = await this._BaseReadOnlyRepository.findManyByField({
      field,
      populate,
      sort,
      page,
      limit,
    });

    return {
      docs: Array.isArray(docs) ? docs : [],
      pageInfo: pagination({count, page, limit}),
      count,
    };
  };
}
