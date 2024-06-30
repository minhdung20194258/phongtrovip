import {AppLoading} from '@/components/index.jsx';

TheSkeleton.propTypes = {};

function TheSkeleton() {
  return (
    <div className="Root-Skeleton">
      <img src={'/logo-md.svg'} alt={'skeleton'} />
      <AppLoading />
    </div>
  );
}

export default TheSkeleton;
