import Users from './Users.router.mjs';
import Test from './Tests.router.mjs';
import Posts from './Posts.router.mjs';
import Chats from './Chats.router.mjs';
import Messages from './Messages.router.mjs';
import Comments from './Comments.router.mjs';
import Reviews from './Reviews.router.mjs';
import Payments from './Payments.router.mjs';
import Activities from './Activities.router.mjs';
import Tooltips from './Tooltips.router.mjs';
import AppResource from './AppResource.router.mjs';
import Admin from './Admin.router.mjs';
import Calendars from './Calendars.router.mjs';
import * as path from 'path';
/**
 * @param {import("express").Application} app
 */
function configRoute(app) {
  app.use('/api/v1/test', Test);

  app.use('/api/v1/admin', Admin);

  app.use('/api/v1/users', Users);
  app.use('/api/v1/posts', Posts);
  app.use('/api/v1/chats', Chats);
  app.use('/api/v1/messages', Messages);
  app.use('/api/v1/comments', Comments);
  app.use('/api/v1/reviews', Reviews);
  app.use('/api/v1/payments', Payments);
  app.use('/api/v1/activities', Activities);
  app.use('/api/v1/tooltips', Tooltips);
  app.use('/api/v1/calendars', Calendars);
  app.use('/api/v1/resource', AppResource);

  app.get('/*', (req, res) => {
    res.sendFile(path.join(path.resolve(), './dist/index.html'));
  });
}

export default configRoute;
