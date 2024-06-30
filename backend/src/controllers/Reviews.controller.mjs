import ReviewsModel from '../models/Reviews.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import ReviewsService from '../services/Reviews.service.mjs';
import ReviewsRepository from '../repositories/Reviews.repository.mjs';

class ReviewsController extends BaseCrudController {
  constructor() {
    super(ReviewsModel, ReviewsRepository);
  }

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  hasReview = async (req, res) => {
    const {writerId, postId, userId, type} = req.query;

    return res.status(200).json({
      success: true,
      data: await ReviewsService.hasReview({writerId, postId, userId, type}),
    });
  };

  createOne = async (req, res) => {
    if (!req.user) throw new Error('Missing authentication user');
    const existingReview = await ReviewsService.hasReview({writerId: req.user._id, ...req.body});
    if (existingReview) throw new Error('Existing review');
    const newReview = await ReviewsService.createOne({writerId: req.user._id, ...req.body});

    return res.status(200).json({
      success: true,
      data: newReview,
    });
  };

  countStar = async (req, res) => {
    const {postId} = req.params;
    const {stars, rate} = await ReviewsService.countStar(postId);

    return res.status(200).json({
      success: true,
      data: {stars, rate},
    });
  };
}

export default new ReviewsController();
