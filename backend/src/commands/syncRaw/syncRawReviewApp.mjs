/* eslint-disable no-unused-vars */
/**
 * @type {import('mongoose').Model}
 */
import connectDatabase from '../../config/cloud/database.mjs';
import fs from 'fs';
import sendMail from '../../services/cloud/maill.service.mjs';
import {postsRequestReject} from '../../config/email/postsEmail.mjs';
import PostsService from '../../services/Posts.service.mjs';
import ActivitiesService from '../../services/Activities.service.mjs';
import PostsRepository from '../../repositories/Posts.repository.mjs';
import PostModel, {PostsModel} from '../../models/Posts.mjs';
import UsersRepository from '../../repositories/Users.repository.mjs';
import ReviewsService from '../../services/Reviews.service.mjs';

(async () => {
  await connectDatabase();
  await mongooseQuery();
})();

async function mongooseQuery() {
  const resp = await UsersRepository.getAll();
  const stars = [3, 4, 5, 5, 5, 4, 5, 3, 4, 5];
  const contents = [
    'Ứng dụng bất động sản này thực sự vượt trội. Giao diện người dùng rất thân thiện và dễ dàng tìm kiếm thông tin về các dự án bất động sản mới. Tính năng lọc theo giá, vị trí và loại hình bất động sản rất tiện lợi, giúp tôi nhanh chóng tìm được căn nhà phù hợp. Đội ngũ hỗ trợ khách hàng cũng rất nhiệt tình và nhanh chóng giải đáp mọi thắc mắc của tôi',
    'Là một nhà đầu tư, tôi đánh giá cao ứng dụng này vì nó cung cấp nhiều thông tin chi tiết và cập nhật về thị trường bất động sản. Biểu đồ giá và các báo cáo phân tích rất hữu ích trong việc đưa ra quyết định đầu tư. Ngoài ra, tính năng thông báo giúp tôi không bỏ lỡ các cơ hội mua bán hấp dẫn.',
    'Trước đây tôi phải mất rất nhiều thời gian để tìm kiếm và xem xét các căn hộ từ nhiều nguồn khác nhau. Ứng dụng bất động sản này đã giải quyết vấn đề đó một cách xuất sắc. Tôi có thể xem thông tin chi tiết, hình ảnh và thậm chí tour ảo của căn hộ ngay trên điện thoại. Đây thực sự là một công cụ hữu ích cho những ai đang tìm kiếm nhà ở.',
    'Ứng dụng này nổi bật với tính năng tìm kiếm bằng bản đồ, giúp tôi dễ dàng xem được vị trí của các bất động sản xung quanh khu vực tôi quan tâm. Thông tin chi tiết về cơ sở hạ tầng, tiện ích xung quanh và giá cả được cập nhật liên tục. Đây là một ứng dụng không thể thiếu cho những ai đang có nhu cầu mua hoặc thuê bất động sản.',
    'Tôi thực sự ấn tượng với dịch vụ khách hàng của ứng dụng bất động sản này. Mọi thắc mắc của tôi đều được giải đáp nhanh chóng và chi tiết. Nhân viên tư vấn rất chuyên nghiệp và nhiệt tình, giúp tôi hiểu rõ hơn về các dự án bất động sản mà tôi quan tâm. Tôi chắc chắn sẽ giới thiệu ứng dụng này cho bạn bè và người thân.',
    'Điều tôi thích nhất về ứng dụng này là tốc độ cập nhật thông tin. Mọi thay đổi về giá, tình trạng bất động sản đều được thông báo ngay lập tức, giúp tôi không bỏ lỡ bất kỳ cơ hội nào. Tính năng thông báo đẩy cũng rất hữu ích, giúp tôi luôn nắm bắt được các thông tin mới nhất về thị trường bất động sản.',
    'Ứng dụng bất động sản này cung cấp một kho thông tin đa dạng và phong phú về các loại hình bất động sản, từ căn hộ chung cư, nhà phố đến biệt thự và đất nền. Mỗi danh sách đều đi kèm với thông tin chi tiết, hình ảnh chất lượng cao và đôi khi có cả video tham quan. Điều này giúp tôi có cái nhìn toàn diện và chính xác trước khi quyết định xem trực tiếp.',
    'Ứng dụng không chỉ giúp tìm kiếm bất động sản mà còn tích hợp nhiều tiện ích khác như tính toán khoản vay, so sánh giá và đánh giá khu vực. Những công cụ này rất hữu ích, giúp tôi dễ dàng tính toán chi phí và đưa ra quyết định đúng đắn. Tôi thực sự đánh giá cao những tính năng này, chúng đã giúp tôi tiết kiệm rất nhiều thời gian và công sức.',
    'Điều làm tôi yên tâm khi sử dụng ứng dụng này là độ tin cậy và tính minh bạch của thông tin. Mọi danh sách bất động sản đều được xác minh rõ ràng, không có tình trạng thông tin sai lệch hay mập mờ. Điều này thực sự quan trọng khi đầu tư vào bất động sản, và ứng dụng đã làm rất tốt việc này. Tôi cảm thấy hoàn toàn yên tâm khi sử dụng dịch vụ của họ.',
    'Ứng dụng bất động sản này mang đến trải nghiệm người dùng tuyệt vời với giao diện thân thiện và trực quan. Tôi có thể dễ dàng duyệt qua hàng trăm danh sách bất động sản và sử dụng các bộ lọc để thu hẹp kết quả tìm kiếm theo nhu cầu của mình. Tính năng lưu các mục yêu thích cũng rất tiện lợi, giúp tôi theo dõi các bất động sản quan tâm một cách dễ dàng.',
  ];

  await Promise.all(
    resp
      .map((user, i) => {
        if (i > 10) return null;

        return ReviewsService.reviewApp({
          writerId: user._id,
          star: stars[i],
          content: contents[i],
        });
      })
      .filter(Boolean),
  );

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
