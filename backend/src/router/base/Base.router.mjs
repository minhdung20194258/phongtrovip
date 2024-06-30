const queryControllerEmpty = (_, res) =>
  res.status(200).json({success: true, data: [], count: 0, pageInfo: {}});

export function initBaseReadOnly(router, controller) {
  router.get('/', controller.getList);
  router.get('/query', controller.findManyByField);
  router.get('/filter', controller.query || queryControllerEmpty);
  router.get('/list/:ids', controller.findMany);
  router.get('/populate/:id/:populate', controller.findOnePopulate || queryControllerEmpty);
  router.get('/public/:id', controller.findOne);
  router.get('/:id', controller.findOne);

  return router;
}

export function initBaseCrud(router, controller) {
  router.post('/', controller.createOne);
  router.put('/:id', controller.updateOne);
  router.delete('/all', controller.deleteAll);
  router.delete('/:ids', controller.deleteMany);

  return router;
}

export function initBase(router, controller) {
  initBaseReadOnly(router, controller);
  initBaseCrud(router, controller);

  return router;
}
