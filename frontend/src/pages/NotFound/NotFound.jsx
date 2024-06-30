/* eslint-disable react/no-unescaped-entities */
import {useRouteError} from 'react-router-dom';
import {IconNotFoundPage} from '@/components/Icons/AppIcon';
import './NotFound.scss';

export default function NotFound() {
  const error = useRouteError();
  console.log(error);

  return (
    <div className="not-found-page">
      <IconNotFoundPage />
      <div>404</div>
      <div>Page not found !!!</div>
      <div>The Page you are looking for doesn't exist or an other error occurred.</div>
      <div>Go back, or head over to choose a new direction.</div>
      <div>{JSON.stringify(error)}</div>
    </div>
  );
}

NotFound.propTypes = {};
