export const USER_LIKE_POST = 'user_like_post';
export const USER_SAVE_POST = 'user_save_post';
export const USER_DISLIKE_POST = 'user_dislike_post';

export const getTypeReact = (type) => {
  switch (type) {
    case 'isUserLikes':
      return USER_LIKE_POST;
    case 'isUserSaves':
      return USER_SAVE_POST;
    case 'isUserDislikes':
      return USER_DISLIKE_POST;
    default:
      return USER_LIKE_POST;
  }
};
