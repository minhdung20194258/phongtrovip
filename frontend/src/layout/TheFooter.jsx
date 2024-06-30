import {AppButton, AppInput} from '@/components/index.jsx';

TheFooter.propTypes = {};

function TheFooter() {
  return (
    <div className="App-Footer">
      <div className="Footer__Item">
        <div className="Footer__Item--Header">
          <div>Dịch vụ</div>
        </div>
        <div className="Footer__Item--List">
          <div>Cho thuê phòng trọ</div>
          <div>Cho thuê chung cư</div>
          <div>Cho thuê nhà ở</div>
        </div>
      </div>
      <div className="Footer__Item">
        <div className="Footer__Item--Header">
          <div>Về PHONGTROVIP</div>
        </div>
        <div className="Footer__Item--List">
          <div>Về chúng tôi</div>
          <div>Liên hệ với chúng tôi</div>
        </div>
      </div>
      <div className="Footer__Item">
        <div className="Footer__Item--Header">
          <div>Đăng ký nhận tin</div>
        </div>
        <div className="mb-8">Nhận thông tin</div>
        <div className="d-flex ai-e">
          <AppInput placeholder="Email" />
          <AppButton>Đăng ký</AppButton>
        </div>
      </div>
    </div>
  );
}

export default TheFooter;
