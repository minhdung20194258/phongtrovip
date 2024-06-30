export default function handleStandardizedQuery(app) {
  app.use((req, res, next) => {
    const {query = {}} = req;

    Object.keys(query).forEach((key) => {
      if (query[key] === 'true') req.query[key] = true;
      if (query[key] === 'false') req.query[key] = false;
    });

    if (query.limit) req.query.limit = parseInt(query.limit);
    if (query.page) req.query.page = parseInt(query.page);

    next();
  });
}
