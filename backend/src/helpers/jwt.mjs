import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Encode id for access token. Token live 60 minutes
 * @param {string} id
 * @param data
 * @param {number} live
 * @returns {string}
 */
export const encodeToken = (id, data, live = 60000 * 60) => {
  return Jwt.sign(
    {
      iss: 'Minh Dung',
      data: data,
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().getTime() + live,
    },
    process.env.JWT_SECRET_ACCESS_TOKEN,
  );
};

/**
 * Encode id for access token. Token live 60 minutes
 * @param {string} id
 * @param {string} role
 * @param {number} live
 * @returns {string}
 */
export const encodeAccessToken = (id, role = 'default', live = 60000 * 60) => {
  return Jwt.sign(
    {
      iss: 'Minh Dung',
      role: role,
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().getTime() + live,
    },
    process.env.JWT_SECRET_ACCESS_TOKEN,
  );
};

/**
 * Encode id for refresh token. Token live 15 days
 * @param id
 * @param role
 * @param live
 * @return {{expiresIn: number, refreshToken: (*)}}
 */
export const encodeRefreshToken = (id, role = 'default', live = 60000 * 60 * 24 * 15) => {
  const expiresIn = new Date().getTime() + live;
  const refreshToken = Jwt.sign(
    {
      iss: 'Minh Dung',
      role: role,
      sub: id,
      iat: new Date().getTime(),
      exp: expiresIn,
    },
    process.env.JWT_SECRET_REFRESH_TOKEN,
  );

  return {
    refreshToken,
    expiresIn,
  };
};
