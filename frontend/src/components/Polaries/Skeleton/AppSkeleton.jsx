import './AppSkeleton.scss';
import PropTypes from 'prop-types';
import {times} from 'lodash';

const AppSkeleton = ({type = 'default', multiples = 5}) => {
  switch (type) {
    case 'square':
      return <span className="skeleton--flash square" />;
    case 'circle':
      return <span className="skeleton--flash circle" />;
    case 'text':
      return (
        <div className="skeleton__text">
          {times(4).map((_, i) => (
            <span className="skeleton--flash text" key={i} />
          ))}
        </div>
      );
    default:
      return (
        <div className="skeleton__container">
          {times(multiples).map((_, i) => (
            <div className="skeleton-item" key={i}>
              <span className="skeleton--flash square" />
              <div className="skeleton__text">
                {times(4).map((__, t) => (
                  <span className="skeleton--flash text" key={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
  }
};

AppSkeleton.propTypes = {
  type: PropTypes.oneOf(['default', 'square', 'circle', 'text']),
  multiples: PropTypes.number,
};

export default AppSkeleton;
