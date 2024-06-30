/**
 * @param req {Express.Request}
 * @return {string}
 */
const getServeUrl = (req) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  return `${protocol}://${host}`;
};

export default getServeUrl;
