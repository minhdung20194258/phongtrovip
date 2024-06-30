import {schedule} from 'node-cron';
import PostsService from '../services/Posts.service.mjs';
import DepositsService from '../services/Deposits.service.mjs';

export default function handleCron() {
  schedule('0 0 * * *', async () => {
    await PostsService.autoPayment();
  });
  schedule('0 0 * * *', async () => {
    await DepositsService.autoRefundDeposit();
  });
}
