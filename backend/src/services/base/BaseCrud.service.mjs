import {BaseException, NotFoundException} from '../exceptions/Exceptions.mjs';
import BaseCrudRepository from '../../repositories/base/BaseCrud.repository.mjs';
import BaseReadOnlyService from './BaseReadOnly.service.mjs';

export default class BaseCrudService extends BaseReadOnlyService {
  /**
   * @param MongooseModel {import('mongoose').Model}
   * @param Repository
   * @constructor
   */
  constructor(MongooseModel, Repository) {
    super(MongooseModel, Repository);
    this._BaseCrudRepository = new BaseCrudRepository(MongooseModel);
  }

  /**
   * @param {string} id
   * @param field {keyof Base}
   * @param items {any[]}
   * @param type {'add' | 'remove'}
   * @returns {Promise<*>}
   */
  updateOneItems = async ({id, field, items, type}) =>
    this._BaseCrudRepository.updateOneItems({id, field, items, type});

  /**
   * @param {Base | any} doc
   * @return {Promise<Base>}
   */
  createOne = async (doc) => this._BaseCrudRepository.createOne(doc);

  /**
   * @param {string} id
   * @param {Base | any} doc
   * @returns {Promise<Base | any>}
   */
  updateOne = async (id, doc) => this._BaseCrudRepository.updateOne(id, doc);

  /**
   * @param {string} id
   * @param {Base} doc
   * @returns {Promise<Base>}
   */
  findByIdAndUpdate = async (id, doc) => this._BaseCrudRepository.findByIdAndUpdate(id, doc);

  /**
   * @param {string[]} ids
   * @param {Base} doc
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateMany = async (ids, doc) => {
    const response = await this._BaseCrudRepository.updateMany(ids, doc);
    return this.validCrud(response, `ids = ${JSON.stringify(ids)}`);
  };

  /**
   * @param {string} id
   * @param {keyof Base} field
   * @param {any[]} items
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateOneAddItems = async (id, field, items) => {
    const response = await this._BaseCrudRepository.updateOneAddItems(id, field, items);
    return this.validCrud(response, `id = ${id}`);
  };

  /**
   * @param {string} id
   * @param {keyof Base} field
   * @param {any[]} items
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateOneRemoveItems = async (id, field, items) => {
    const response = await this._BaseCrudRepository.updateOneRemoveItems(id, field, items);
    return this.validCrud(response, `id = ${id}`);
  };

  /**
   * @param {string[]} ids
   * @param {keyof Base} field
   * @param {any[]} items
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateManyAddItems = async (ids, field, items) => {
    const response = await this._BaseCrudRepository.updateManyAddItems(ids, field, items);
    return this.validCrud(response, `ids = ${JSON.stringify(ids)}`);
  };

  /**
   * @param {string[]} ids
   * @param {keyof Base} field
   * @param {any[]} items
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateManyRemoveItems = async (ids, field, items) => {
    const response = await this._BaseCrudRepository.updateManyRemoveItems(ids, field, items);
    return this.validCrud(response, `ids = ${JSON.stringify(ids)}`);
  };

  /**
   * @param {string} id
   * @returns {Promise<{acknowledged:Boolean, deletedCount:Number}>}
   */
  deleteOne = async (id) => {
    const response = await this._BaseCrudRepository.deleteOne(id);
    return this.validCrud(response, `id = ${id}`);
  };

  /**
   * @param {string[]} ids
   * @returns {Promise<{acknowledged:Boolean, deletedCount:Number}>}
   */
  deleteMany = async (ids) => {
    const response = await this._BaseCrudRepository.deleteMany(ids);
    return this.validCrud(response, `ids = ${JSON.stringify(ids)}`);
  };

  deleteAll = async () => this._BaseCrudRepository.deleteAll();

  /**
   * @param {keyof Base} field
   * @param {any} fieldValue
   * @returns {Promise<{acknowledged:Boolean, deletedCount:Number}>}
   */
  deleteManyByFieldId = async (field, fieldValue) => {
    const response = this._BaseCrudRepository.deleteManyByField(field, fieldValue);
    return this.validCrud(response, `${field} = ${fieldValue}`);
  };

  /**
   * @param response
   * @param mess
   * @returns {*}
   */
  validCrud = (response, mess) => {
    if (response.matchedCount === 0) {
      throw new NotFoundException(
        'NOT_FOUND',
        `Not found '${this._BaseCrudRepository.getModelName()}' in ${mess}!`,
      );
    }
    if (response.modifiedCount === 0) {
      throw new BaseException(
        400,
        'FAILED',
        `Update '${this._BaseCrudRepository.getModelName()}' in ${mess} failed!`,
      );
    }
    if (response.deletedCount === 0) {
      throw new BaseException(
        400,
        'FAILED',
        `Delete '${this._BaseCrudRepository.getModelName()}' in ${mess} failed!`,
      );
    }

    return response;
  };
}
