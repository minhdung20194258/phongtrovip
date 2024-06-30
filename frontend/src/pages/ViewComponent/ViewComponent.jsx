import AppButton from '@/components/Button/AppButton';
import AppInput from '@/components/Input/AppInput';
import AppDialog from '@/components/Dialog/AppDialog';
import AppToast from '@/components/Toast/AppToast';
import {IconCart} from '@/components/Icons/AppIcon';
import {useState} from 'react';
import {Outlet, Link} from 'react-router-dom';
import AppCombobox from '@/components/Combobox/AppCombobox.jsx';

function ViewComponent() {
  const [isDialog, setIsDialog] = useState(false);
  const [comboboxCheck, setComboboxCheck] = useState({value: 1, label: 'Option 1'});
  const testFUn = async () => {};

  const datas = [
    {value: 1, label: 'Option 1'},
    {value: 2, label: 'Option 2'},
    {value: 3, label: 'Option 3'},
    {value: 4, label: 'Grapes'},
    {value: 5, label: 'Strawberry'},
    {value: 6, label: 'Watermelon'},
    {value: 7, label: 'Pineapple'},
    {value: 8, label: 'Mango'},
    {value: 9, label: 'Peach'},
    {value: 10, label: 'Banana'},
    {value: 11, label: 'Orange'},
    {value: 12, label: 'Kiwi'},
    {value: 13, label: 'Blueberry'},
    {value: 14, label: 'Cherry'},
    {value: 15, label: 'Lemon'},
    {value: 16, label: 'Pear'},
    {value: 17, label: 'Apple'},
    {value: 18, label: 'Apricot'},
    {value: 19, label: 'Blackberry'},
    {value: 20, label: 'Cranberry'},
  ];

  return (
    <>
      <Outlet />
      <Link to="/test">test</Link>
      <div className="p-4"></div>
      <Link to="/test2">test2</Link>
      <AppToast header="trueeeee" content="rrorMess=V"></AppToast>
      {isDialog && (
        <AppDialog
          type="error"
          onClose={() => setIsDialog((prev) => !prev)}
          content="equired icon={IconCart} errorMess=Vui longf nhap mat khau ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap ired icon={IconCart} errorMess=Vui longf nhap"
        />
      )}
      <div className="row p-50">
        <div className="col-2 pr-50">
          <AppCombobox
            label={'App combobox'}
            options={datas}
            selected={comboboxCheck}
            onSelected={(item) => setComboboxCheck(item)}
          />
          <div className="h-250"></div>
          <AppInput label="Email" required icon={IconCart} errorMess={'Vui longf nhap mat khau'} />
        </div>
        <div className="col-2">
          <div>Primary</div>
          <AppButton loading>Save</AppButton>
          <div className="mb-10"></div>
          <div>Secondary</div>
          <AppButton
            type={'secondary'}
            icon={IconCart}
            text="Open dialog"
            onClick={() => setIsDialog((prev) => !prev)}
          />
          <div className="mb-10"></div>
          <div>Border</div>
          <AppButton type={'border'} icon={IconCart} text="Test loading" onClick={testFUn} />
          <div>Border 1</div>
          <AppButton type={'border-1'} icon={IconCart} text="Test loading" onClick={testFUn} />
          <div className="mb-10"></div>
          <AppButton type={'border-1'} text="Save" />
          <div className="mb-10"></div>
          <div>Icon</div>
          <AppButton icon={IconCart} text="Save" />
          <div className="mb-10"></div>
          <div>Circle</div>
          <AppButton type={'circle'} icon={IconCart} />
          <div className="mb-10"></div>
          <div>Transparent</div>
          <AppButton type={'transparent'} icon={IconCart} text="Save" />
          <div className="mb-10"></div>
          <div>Notext1</div>
          <AppButton type={'no-text-1'} icon={IconCart} />
          <div className="mb-10"></div>
          <div>Notext2</div>
          <AppButton type={'no-text-2'} icon={IconCart} />
          <div>Notext3</div>
          <AppButton type={'no-text-3'} icon={IconCart} />
          <div className="mb-10"></div>
          <div>Text</div>
          <AppButton type={'text'} icon={IconCart} text="Save" />
          <div>Tab</div>
          <AppButton type={'tab'} icon={IconCart} text="Save" />
        </div>
      </div>
    </>
  );
}

export default ViewComponent;
