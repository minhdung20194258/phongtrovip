import BaseCrudService from './base/BaseCrud.service.mjs';
import ReviewsModel from '../models/Reviews.mjs';
import ReviewsRepository from '../repositories/Reviews.repository.mjs';
import PostsService from './Posts.service.mjs';
import {REVIEW_APP, REVIEW_POST, REVIEW_REPORT_USER} from '../const/types/reviewTypes.mjs';

class ReviewsService extends BaseCrudService {
  constructor() {
    super(ReviewsModel, ReviewsRepository);
  }

  hasReview = async ({userId, writerId, postId, type}) => {
    return ReviewsRepository.hasReview({userId, writerId, postId, type});
  };

  reportUser = async (doc = {}) => {
    const {content, writerId, userId, reasons} = doc;
    if (await ReviewsRepository.hasReport({writerId, userId})) return null;
    return ReviewsRepository.createOne({
      writerId,
      userId,
      content,
      reasons,
      type: REVIEW_REPORT_USER,
    });
  };

  reviewApp = async (doc = {}) => {
    const {star, content, writerId} = doc;
    if (await ReviewsRepository.hasExistReviewApp(writerId)) return null;
    return ReviewsRepository.createOne({star, content, writerId, type: REVIEW_APP});
  };

  reviewPost = async (doc = {}) => {
    const {star, postId, writerId} = doc;
    if (await ReviewsRepository.hasExistReviewPost(postId, writerId)) return null;

    const [newItem, {review = 0, countReviews = 0}] = await Promise.all([
      ReviewsRepository.createOne({...doc, type: REVIEW_POST}),
      PostsService.findOne(postId),
    ]);
    await PostsService.updateOne(postId, {
      review: ((review * countReviews + parseInt(star)) / (countReviews + 1)).toFixed(2),
      countReviews: countReviews + 1,
    });

    return newItem;
  };

  countStar = async (postId) => {
    const stars = await ReviewsRepository.countStar(postId);
    const totalRate = stars.reduce((total, currentStar) => {
      return total + currentStar.count * currentStar._id;
    }, 0);
    const count = stars.reduce((total, currentStar) => {
      return total + currentStar.count;
    }, 0);

    const formatStars = [1, 2, 3, 4, 5].map((_, i) => {
      const star = stars.find((item) => item._id === i + 1);
      return {star: i + 1, count: star ? star.count : 0};
    });

    return {
      stars: formatStars,
      rate: totalRate / count || 5,
    };
  };
}

export default new ReviewsService();
