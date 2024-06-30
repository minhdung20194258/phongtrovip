import bcrypt from 'bcrypt';

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
export const hashText = async (text) => {
  if (!text) return '';

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(text, salt);
};
