import './styles/TheLayout.scss';
import './styles/TheNavbar.scss';
import TheNavbar from '@/layout/TheNavbar.jsx';
import TheContent from '@/layout/TheContent.jsx';
import TheFooter from '@/layout/TheFooter.jsx';
import {useLocation} from 'react-router-dom';

TheLayout.propTypes = {};
function TheLayout() {
  const location = useLocation();
  const pathNameHiddenFooter = ['user', 'admin'];

  return (
    <div className="App-Main">
      <TheNavbar />
      <TheContent>
        {!pathNameHiddenFooter.find((i) => location.pathname.includes(i)) && <TheFooter />}
      </TheContent>
    </div>
  );
}

export default TheLayout;
