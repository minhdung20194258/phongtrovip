import TooltipsModel from '../models/Tooltips.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import TooltipsService from '../services/Tooltips.service.mjs';
import TooltipsRepository from '../repositories/Tooltips.repository.mjs';

class TooltipsController extends BaseCrudController {
  constructor() {
    super(TooltipsModel, TooltipsRepository);
  }

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  createOne = async (req, res) => {
    const {
      body: {data: dataJson},
      user = {},
      images = [],
    } = req;
    const data = {...JSON.parse(dataJson), ...(images[0] ? {image: images[0]} : {})};
    const tooltip = data._id
      ? await TooltipsService.updateOne(data._id, data)
      : await TooltipsService.createOne({...data, userId: user._id});
    return res.status(200).json({success: true, data: tooltip});
  };
}

export default new TooltipsController();
