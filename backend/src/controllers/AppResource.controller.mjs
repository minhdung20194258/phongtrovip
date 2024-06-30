import {getDistrictsMin, getProvincesMin, getWardsMin} from '../const/mongoose/areaQuery.mjs';
import {getBank, getBanksList} from '../const/mongoose/bankingQuery.mjs';

class AppResourceController {
  constructor() {}

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getAllBanks = async (req, res) => {
    return res.status(200).json({
      success: true,
      data: getBanksList(),
    });
  };

  getBank = async (req, res) => {
    const {bankId} = req.params;

    return res.status(200).json({
      success: true,
      data: getBank(bankId),
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getProvinces = async (req, res) => {
    return res.status(200).json({
      success: true,
      data: getProvincesMin(),
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getDistricts = async (req, res) => {
    const {provinceId} = req.params;

    return res.status(200).json({
      success: true,
      data: provinceId ? getDistrictsMin(provinceId) : [],
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getWards = async (req, res) => {
    const {districtId, provinceId} = req.params;

    return res.status(200).json({
      success: true,
      data: districtId && provinceId ? getWardsMin(provinceId, districtId) : [],
    });
  };
}

export default new AppResourceController();
