import connectDatabase from '../../config/cloud/database.mjs';
import PostsRepository from '../../repositories/Posts.repository.mjs';

(async () => {
  await connectDatabase();
  await mongooseQuery();
})();

async function mongooseQuery() {
  const posts = await PostsRepository.getAll();

  await Promise.all(
    posts.map((post, i) =>
      PostsRepository.updateOne(post._id, {
        embedGoogleMap:
          '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.3388850560996!2d105.78307297587152!3d20.97904858948289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accd88c1276b%3A0xc7ec85c744d8874e!2zSOG7kyBHxrDGoW0gUGxhemE!5e0!3m2!1svi!2s!4v1719586947929!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        floor: 2,
        roomCountInfo: '2N1K',
        houseArea: 15 + i * 2,
      }),
    ),
  );
}
