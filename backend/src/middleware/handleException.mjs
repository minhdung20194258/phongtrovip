import {NotFoundException} from '../services/exceptions/Exceptions.mjs';

/**
 * @param {import("express").Application} app
 */
export default function handleException(app) {
  // For not found route
  app.use(
    /**
     * @param req {import('express').Request}
     * @param res {import('express').Response}
     * @param next {import('express').NextFunction}
     * @return {*}
     */
    (req, res, next) => {
      const error = new NotFoundException('NOT_FOUND_API', `Not found API '${req.path}' endpoint.`);
      return next(error);
    },
  );

  app.use(
    /**
     * @param err {{code: string, message: string}}
     * @param req {import('express').Request}
     * @param res {import('express').Response}
     * @param next {import('express').NextFunction}
     * @return {*}
     */
    (err, req, res, next) => {
      console.log(err);
      return res.status(200).json({
        success: false,
        message: err.message,
        detail: err,
      });
    },
  );
}
