import connectDatabase from '../../config/cloud/database.mjs';
import PostsRepository from '../../repositories/Posts.repository.mjs';
import DepositsRepository from '../../repositories/Deposits.repository.mjs';

(async () => {
  await connectDatabase();
  await mongooseQuery();
})();

async function mongooseQuery() {
  const posts = await DepositsRepository.getAll();

  await Promise.all(
    posts.map((post) =>
      DepositsRepository.updateOne(post._id, {
        isSenderRefund: false,
        senderReasons: [],
      }),
    ),
  );
}
