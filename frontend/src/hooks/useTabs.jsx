import {useState} from 'react';
import PropTypes from 'prop-types';
import {AppButton} from '@/components/index.jsx';

useTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
    }),
  ),
  size: PropTypes.oneOf(['sm', 'lg', 'md']),
};

/**
 * @param tabs {[{id: any, content: any}]}
 * @param initSelected {any}
 * @param size {'lg' | 'md' | 'sm'}
 * @param onTab
 * @param onSelect
 * @return {{btnTabs: React.JSX.Element, selected: unknown, mockup: *}}
 */

function useTabs({tabs, initSelected = null, size, onTab = () => {}, onSelect = () => {}}) {
  const [selected, setSelected] = useState(initSelected);

  const btnTabs = (
    <div className="d-flex gap-8">
      {tabs.map((tab, i) => (
        <AppButton
          type="tab"
          isActive={selected === tab.id}
          key={i}
          text={tab.content}
          onClick={() => {
            setSelected(tab.id);
            onTab(tab.id);
            onSelect(tab);
          }}
          size={size}
        />
      ))}
    </div>
  );

  return {selected, btnTabs, mockup: tabs.find((tab) => tab.id === selected)?.mockup};
}

export default useTabs;
