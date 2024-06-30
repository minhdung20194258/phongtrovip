import React from 'react';
import PropTypes from 'prop-types';

import './AppBadgeVip.scss';
import {IconStar, IconStarBold} from '@/components/Icons/AppIcon.jsx';
AppBadgeVip.propTypes = {};

function AppBadgeVip() {
  return (
    <div className="App-BadgeVip">
      <div className="App-BadgeVip__VIPStar">
        <IconStarBold />
        <div className="fw-900 fs-16">VIP</div>
        <div className="App-BadgeVip__VIPStar--Slash1"></div>
        <div className="App-BadgeVip__VIPStar--Slash2"></div>
      </div>
      <div className="App-BadgeVip__Discount">Ưu đãi</div>
    </div>
  );
}

export default AppBadgeVip;
