import PropTypes from 'prop-types';
import MDEditor from '@uiw/react-md-editor';
import './TooltipsItem.scss';
import {AppBadge} from '@/components/index.jsx';

TooltipsItem.propTypes = {
  tooltip: PropTypes.object,
};

function TooltipsItem({tooltip}) {
  return (
    <div className="App-TooltipsItem" key={tooltip._id}>
      <div className="TooltipsItem__Img">
        <img src={tooltip?.image.url} alt="" />
        <AppBadge tone="info-bold">Mẹo vặt cuộc sống</AppBadge>
      </div>
      <div className="d-flex-col h-180">
        <div className="fw-700 fs-20">{tooltip.title}</div>
        <MDEditor.Markdown source={tooltip.content} />
      </div>
    </div>
  );
}

export default TooltipsItem;
