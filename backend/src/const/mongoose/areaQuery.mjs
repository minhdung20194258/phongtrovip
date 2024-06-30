import areas from './resource/areaVN.mjs';
import {pick} from '../../helpers/untils.mjs';

const customPicker = (arr = []) => arr.map((item) => pick(item, ['Code', 'FullName']));

export const getProvinces = () => areas;
export const getDistricts = (pId) => (areas.find((area) => area.Code === pId) || {}).District;
export const getWards = (pId, dId) =>
  (getDistricts(pId).find((district) => district.Code === dId) || {}).Ward;

export const getProvincesMin = () => customPicker(getProvinces());
export const getDistrictsMin = (pId) => customPicker(getDistricts(pId));
export const getWardsMin = (pId, dId) => customPicker(getWards(pId, dId));

export const getAddressString = ({province: pId, district: dId, ward: wId}) => {
  const province = areas.find((i) => i.Code === pId) || {District: []};
  const district = province.District.find((i) => i.Code === dId) || {Ward: []};
  const ward = district.Ward.find((i) => i.Code === wId) || {};

  return [province.FullName, district.FullName, ward.FullName].reverse().join(', ');
};
