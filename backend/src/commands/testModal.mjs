/* eslint-disable no-unused-vars */
/**
 * @type {import('mongoose').Model}
 */
import connectDatabase from '../config/cloud/database.mjs';
import fs from 'fs';
import DepositsModel from '../models/Deposits.mjs';
import OtpsService from '../services/Otps.service.mjs';
import PostsRepository from '../repositories/Posts.repository.mjs';
import DepositsRepository from '../repositories/Deposits.repository.mjs';
import DepositsService from '../services/Deposits.service.mjs';

(async () => {
  await connectDatabase();
  await mongooseQuery();
})();

async function mongooseQuery() {
  // const posts = await PostsRepository.getAll();
  //
  // let resp = [];
  // posts.forEach((post) => {
  //   resp = [...resp, ...post.images];
  // });

  const resp = await DepositsService.autoRefundDeposit();
  console.log(resp);

  fs.writeFile('./data.json', JSON.stringify(resp), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file has been written successfully.');
    }
  });
}

// fs.writeFile('./data.json', JSON.stringify(resp), (err) => {
//   if (err) {
//     console.error('Error writing JSON file:', err);
//   } else {
//     console.log('JSON file has been written successfully.');
//   }
// });
