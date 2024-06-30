import UsersRepository from '../repositories/Users.repository.mjs';
import BaseCrudService from './base/BaseCrud.service.mjs';
import UsersModel from '../models/Users.mjs';
import {hashText} from '../helpers/bcript.mjs';
import ReactionsService from './Reactions.service.mjs';
import {USER_LIKE_POST} from '../const/types/reactionPostTypes.mjs';

class UsersService extends BaseCrudService {
  constructor() {
    super(UsersModel, UsersRepository);
  }

  /**
   * @param {string} id
   * @param {Users | any} doc
   * @returns {Promise<Users | any>}
   */
  updateOne = async (id, doc) => {
    const password = doc.password ? await hashText(doc.password) : '';
    return UsersRepository.updateOne(id, {...doc, ...(password ? {password} : {})});
  };

  reactPost = async ({userId, postId, type = USER_LIKE_POST}) => {
    const react = await ReactionsService.findReact({userId, postId, type});
    return react
      ? await ReactionsService.deleteOne(react._id)
      : await ReactionsService.createOne({userId, postId, type});
  };

  /**
   * Find one by email
   * @param {string} email
   * @returns {Promise<Users>}
   */
  findOneByEmail = async (email) => {
    return UsersRepository.findOneByEmail(email);
  };
}

export default new UsersService();
