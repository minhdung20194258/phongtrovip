import {createBrowserRouter} from 'react-router-dom';
import ViewComponent from '@/pages/ViewComponent/ViewComponent';
import NotFound from '@/pages/NotFound/NotFound';
import TestPage from '@/pages/ViewComponent/TestPage';
import SignIn from '@/pages/Auth/SignIn/SignIn';
import App from '@/App';
import SignUp from '@/pages/Auth/SignUp/SignUp.jsx';
import ViewIconComponent from '@/components/Icons/ViewIconComponent.jsx';
import User from '@/pages/User/User.jsx';
import ForgotPassword from '@/pages/Auth/ForgotPassword/ForgotPassword.jsx';
import PostNew from '@/pages/Post/PostForm/PostNew/index.jsx';
import PostPreview from '@/pages/Post/index.jsx';
import PostItemDetail from '@/pages/Post/PostItemDetail/PostItemDetail.jsx';
import Chat from '@/pages/Chat/Chat.jsx';
import Payment from '@/pages/Payment/Payment.jsx';
import PaymentStatus from '@/pages/Payment/PaymentStatus.jsx';
import PostEdit from '@/pages/Post/PostForm/PostEdit/PostEdit.jsx';
import Plans from '@/pages/Plans/Plans.jsx';
import Dashboard from '@/pages/DashBoard/Dashboard.jsx';
import Admin from '@/pages/Admin/Admin.jsx';
import UserPublic from '@/pages/UserPublic/UserPublic.jsx';

const daft = [
  {
    path: 'c',
    element: <ViewComponent />,
  },
  {
    path: 'general',
    element: <ViewComponent />,
  },
  {
    path: 'i',
    element: <ViewIconComponent />,
  },
  {
    path: 'icon',
    element: <ViewIconComponent />,
  },
  {
    path: 'test',
    element: <TestPage />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      ...daft,

      // {
      //   path: 'posts',
      //   children: [
      //     {
      //       path: 'new',
      //       element: <PostNew />,
      //     },
      //   ],
      // },
      {
        path: '/user/show/:userPublicId',
        element: <UserPublic />,
      },
      {
        path: '/admin',
        element: <Admin />,
      },
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: '/list',
        element: <PostPreview />,
      },
      {
        path: 'payments',
        element: <Payment />,
      },
      {
        path: 'plans',
        element: <Plans />,
      },
      {
        path: 'payments/status/:status',
        element: <PaymentStatus />,
      },
      {
        path: 'message',
        element: <Chat />,
      },
      {
        path: 'message/:chatId',
        element: <Chat />,
      },
      {
        path: 'posts/new',
        element: <PostNew />,
      },
      {
        path: 'posts/edit/:postId',
        element: <PostEdit />,
      },
      {
        path: 'posts/:postId',
        element: <PostItemDetail />,
      },
      {
        path: 'posts/deposit/:postId',
        element: <PostItemDetail />,
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'forgot-pass',
        element: <ForgotPassword />,
      },
      {
        path: 'user/profile',
        element: <User />,
      },
    ],
  },
]);

export default router;
