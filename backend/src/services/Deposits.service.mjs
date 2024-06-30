import BaseCrudService from './base/BaseCrud.service.mjs';
import DepositsModel from '../models/Deposits.mjs';
import DepositsRepository from '../repositories/Deposits.repository.mjs';
import UsersRepository from '../repositories/Users.repository.mjs';
import ActivitiesService from './Activities.service.mjs';
import {ACTIVITY_AUTO_REFUND_DEPOSIT_OWNER} from '../const/types/activitiesTypes.mjs';

class DepositsService extends BaseCrudService {
  constructor() {
    super(DepositsModel, DepositsRepository);
  }

  autoRefundDeposit = async () => {
    const depositsToRefund = await DepositsRepository.getDepositRefund();
    let jobs = [];
    depositsToRefund.forEach((deposit) => {
      jobs = [
        ...jobs,
        UsersRepository.increaseOne(deposit.receiverId, 'amountBalance', 500000),
        DepositsRepository.updateOne(deposit._id, {isRefund: true, refundDate: new Date()}),
        ActivitiesService.createOne({
          userId: deposit.receiverId,
          type: ACTIVITY_AUTO_REFUND_DEPOSIT_OWNER,
          amount: 500000,
          postId: deposit.postId,
          info: {senderId: deposit.senderId, depositId: deposit._id},
        }),
      ];
    });
    return Promise.all(jobs);
  };
}

export default new DepositsService();
