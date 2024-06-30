import BaseReadOnlyRepository from './BaseReadOnly.repository.mjs';

export default class BaseCrudRepository extends BaseReadOnlyRepository {
  /**
   * @param MongooseModel {import('mongoose').Model}
   */
  constructor(MongooseModel) {
    super(MongooseModel);
    this.MongooseModel = MongooseModel;
  }

  /**
   * @param filter
   * @return {*}
   */
  findOneAndDelete = (filter) => this.MongooseModel.findOneAndDelete(filter);

  /**
   * @param id
   * @return {*}
   */
  findByIdAndDelete = (id) => this.MongooseModel.findByIdAndDelete(id);

  /**
   * @param key {keyof Base}
   * @return {*}
   */
  deleteField = (key) => this.MongooseModel.updateMany({}, {$unset: {[key]: 1}}, {multi: true});

  /**
   * @param id
   * @param field
   * @param changeAmount
   * @return {Promise<Base>|*}
   */
  increaseOne = (id, field, changeAmount = 1) => {
    return this.MongooseModel.findOneAndUpdate(
      {_id: id},
      {$inc: {[field]: changeAmount}},
      {new: true},
    );
  };

  /**
   * @param id
   * @param doc
   * @return {Promise<Base>|*}
   */
  findByIdAndUpdate = (id, doc) => {
    // ! Nếu viet dan {...depthNested} no bi thua field dan den th bi fail
    return this.MongooseModel.findByIdAndUpdate(id, doc, {new: true});
  };

  /**
   * @param {Object} doc
   * @returns {Base}
   */
  createOne = (doc) => {
    return new this.MongooseModel(doc).save();
  };

  /**
   * @param {string} id
   * @param {Object} doc
   * @returns {Promise<Object>}
   */
  updateOne = (id, doc) => {
    // ! Nếu viet dan {...depthNested} no bi thua field dan den th bi fail
    return this.MongooseModel.findOneAndUpdate({_id: id}, doc, {new: true});
  };

  /**
   * @param {string[]} ids
   * @param {Base} doc
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateMany = (ids, doc) => {
    return this.MongooseModel.updateMany({_id: {$in: ids}}, doc);
  };

  /**
   * @param id
   * @param field {keyof Base}
   * @param items {any[]}
   * @param type {'add' | 'remove'}
   * @returns {Promise<*>}
   */
  updateOneItems = ({id, field, items, type}) => {
    const update = (() => {
      switch (type) {
        case 'add':
          return {$addToSet: {[field]: {$each: items}}};
        case 'remove':
          return {$pullAll: {[field]: items}};
        default:
          return {$addToSet: {[field]: {$each: items}}};
      }
    })();

    return this.MongooseModel.findOneAndUpdate({_id: id}, update, {new: true});
  };

  /**
   * @param {string} id
   * @param field {keyof Base}
   * @param items {any[]}
   * @returns {Promise<*>}
   */
  updateOneAddItems = (id, field, items) => {
    return this.MongooseModel.findOneAndUpdate(
      {_id: id},
      {$addToSet: {[field]: {$each: items}}},
      {new: true},
    );
  };

  /**
   * @param id
   * @param field {keyof Base}
   * @param items {any[]}
   * @returns {Promise<*>}
   */
  updateOneRemoveItems = (id, field, items) => {
    return this.MongooseModel.findOneAndUpdate(
      {_id: id},
      {$pullAll: {[field]: items}},
      {new: true},
    );
  };

  /**
   * @param {string[]} ids
   * @param {string} field
   * @param {any[]} items
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateManyAddItems = (ids, field, items) => {
    return this.MongooseModel.updateMany({_id: {$in: ids}}, {$addToSet: {[field]: items}});
  };

  /**
   * @param {string[]} ids
   * @param {string} field
   * @param {any[]} items
   * @returns {Promise<{acknowledged:Boolean, modifiedCount:Number, upsertedId:null, upsertedCount:Number, matchedCount:Number}>}
   */
  updateManyRemoveItems = (ids, field, items) => {
    return this.MongooseModel.updateMany({_id: {$in: ids}}, {$pull: {[field]: items}});
  };

  /**
   * @param {string} id
   * @returns {Promise<{acknowledged:Boolean, deleteCount:Number}>}
   */
  deleteOne = (id) => {
    return this.MongooseModel.deleteOne({_id: id});
  };

  /**
   * @param {string[]} ids
   * @returns {Promise<{acknowledged:Boolean, deleteCount:Number}>}
   */
  deleteMany = (ids) => {
    return this.MongooseModel.deleteMany({_id: {$in: ids}});
  };

  /**
   * @param {keyof Base} field
   * @param {any} fieldValue
   * @returns {Promise<{acknowledged:Boolean, deleteCount:Number}>}
   */
  deleteManyByField = (field, fieldValue) => {
    return this.MongooseModel.deleteMany({[field]: fieldValue});
  };

  /**
   * @returns {Promise<{acknowledged:Boolean, deleteCount:Number}>}
   */
  deleteAll = () => {
    return this.MongooseModel.deleteMany({});
  };
}
