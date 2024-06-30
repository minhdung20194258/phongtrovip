import bankingVN from './resource/bankingVN.mjs';

export const getBanksList = () => bankingVN;
export const getBank = (bankId) => bankingVN.find((i) => i.id === parseInt(bankId));
