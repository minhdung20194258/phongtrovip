import {AppCombobox, AppInput} from '@/components/index.jsx';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';
import {transferOptions} from '@/const/options/paymentOptions.js';
import {splitMoney} from '@/helper/formats.js';
import {paymentRules} from '@/config/validations/paymentValidations.js';
import useModal from '@/hooks/modal/useModal.jsx';
import {useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import {pick} from 'lodash';
import PropTypes from 'prop-types';

usePaymentRequiredForm.propTypes = {
  refresh: PropTypes.func,
};

function usePaymentRequiredForm({refresh = () => {}, banks = []}) {
  const user = useSelector(getUser);
  const {input, handleChange, setInput, validations, handleValidations} = useInputValidations({
    initialState: {
      amount: 0,
      bankInfo: {},
    },
    configRules: paymentRules,
  });
  const {handleCreate} = useCreateApi({
    url: 'users/requests',
    successCallback: () => refresh(),
    successMsg: 'Chúng tôi sẽ xem xét và xử lý yêu cầu của bạn trong vòng 7 ngày.',
  });

  const handleSave = async () => {
    if (!handleValidations()) return;
    if (user.amountBalance < parseInt(input.amount)) return;

    return handleCreate({
      _id: input._id,
      amount: input.amount,
      bankInfo: pick(input.bankInfo, ['id', 'accountNumber', 'accountName', 'accountCreatedAt']),
    });
  };

  const {modal, openModal} = useModal({
    header: input._id ? 'Chỉnh sửa yêu cầu hoàn tiền' : 'Tạo mới yêu cầu hoàn tiền',
    primaryAction: {
      onAction: () => handleSave(),
    },
    secondaryAction: {
      content: '',
    },
    content: (
      <div className="d-flex-col gap-16">
        <AppCombobox
          label="Số tiền"
          options={transferOptions.map((amount) => ({
            label: splitMoney(amount),
            value: amount,
          }))}
          onSelected={(val) => handleChange('amount', val)}
          selected={input.amount}
          errorMess={validations.amount}
        />
        <AppCombobox
          label="Ngân hàng"
          options={banks.map((bank) => ({
            label: bank.name,
            value: bank.id,
            prefix: <img src={bank.logo} alt={'logo'} className={'h-24'} />,
            ...bank,
          }))}
          onSelected={(_, __, item) => handleChange('bankInfo', {...input.bankInfo, ...item})}
          selected={input.bankInfo?.id}
          classNameInput="pl-84"
          errorMess={validations.id}
        />
        <AppInput
          type="number"
          label="Số tài khoản"
          value={input.bankInfo?.accountNumber}
          onChange={(val) => handleChange('bankInfo', {...input.bankInfo, accountNumber: val})}
          errorMess={validations.accountNumber}
        />
        <AppInput
          label="Tên tài khoản"
          value={input.bankInfo?.accountName}
          onChange={(val) => handleChange('bankInfo', {...input.bankInfo, accountName: val})}
          errorMess={validations.accountName}
        />
        <AppInput
          label="Ngày tạo"
          value={input.bankInfo?.accountCreatedAt}
          onChange={(val) => handleChange('bankInfo', {...input.bankInfo, accountCreatedAt: val})}
          errorMess={validations.accountCreatedAt}
        />
      </div>
    ),
  });

  return {
    modal,
    openModal: (request) => {
      setInput(request || {amount: 0, bankInfo: {}});
      openModal();
    },
  };
}

export default usePaymentRequiredForm;
