import {trim} from '../../helpers/untils.mjs';
import BaseCrudService from '../../services/base/BaseCrud.service.mjs';
import BaseReadOnlyController from './BaseReadOnly.controller.mjs';

class BaseCrudController extends BaseReadOnlyController {
  constructor(MongooseModel, Repository) {
    super(MongooseModel, Repository);
    this._BaseCrudService = new BaseCrudService(MongooseModel, Repository);
  }

  createOne = async (req, res) => {
    const rawDoc = req.body;
    const newDoc = await this._BaseCrudService.createOne(trim(rawDoc));

    return res.status(200).json({
      success: true,
      data: newDoc,
    });
  };

  updateOne = async (req, res) => {
    const {id} = req.params;
    const rawDoc = req.body;

    const response = await this._BaseCrudService.updateOne(id, trim(rawDoc));

    return res.status(200).json({
      success: true,
      data: response,
    });
  };

  updateMany = async (req, res) => {
    const {ids} = req.params;
    const rawDoc = req.body;

    const response = await this._BaseCrudService.updateMany(ids.split(','), trim(rawDoc));

    return res.status(200).json({
      success: true,
      data: response,
    });
  };

  deleteOne = async (req, res) => {
    const {id} = req.params;

    const response = await this._BaseCrudService.deleteOne(id);

    return res.status(200).json({
      success: true,
      data: response,
    });
  };

  deleteMany = async (req, res) => {
    const {ids} = req.params;

    const response = await this._BaseCrudService.deleteMany(ids.split(','));

    return res.status(200).json({
      success: true,
      data: response,
    });
  };

  //! For development
  deleteAll = async (req, res) => {
    const response = await this._BaseCrudService.deleteAll();

    return res.status(200).json({
      success: true,
      data: response,
    });
  };
}

export default BaseCrudController;
