import CommentsModel from '../models/Comments.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import CommentsService from '../services/Comments.service.mjs';
import pagination from '../helpers/pagination.mjs';
import CommentsRepository from '../repositories/Comments.repository.mjs';

class CommentsController extends BaseCrudController {
  constructor() {
    super(CommentsModel, CommentsRepository);
  }

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  createOne = async (req, res) => {
    const {user, body} = req;
    if (!user)
      return res.status(200).json({
        success: false,
        message: 'Missing username',
      });

    const newComment = await CommentsService.createOne({senderId: user._id, ...body});

    return res.status(200).json({
      success: true,
      data: newComment,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getByPostId = async (req, res) => {
    const {page = '0', sort, limit} = req.query;
    const {postId} = req.params;
    const {docs, count} = await CommentsService.Repo.getByPostId({
      postId,
      page: parseInt(page),
    });

    return res.status(200).json({
      success: true,
      data: docs,
      pageInfo: pagination({
        count,
        page: parseInt(page),
        limit,
      }),
      count,
    });
  };
}

export default new CommentsController();
