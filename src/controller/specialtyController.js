import specialtyAPIService from "../service/specialtyAPIService";

const getTopSpecialtyHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let specialties = await specialtyAPIService.getTopSpecialty(+limit);
    return res.status(200).json(specialties);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      EC: -1,
      EM: "Error from server...",
      DT: "",
    });
  }
};

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await specialtyAPIService.getSpecialtyWithPagination(
        +page,
        +limit
      );
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await specialtyAPIService.getAllSpecialties();
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.error("check readFunc: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

let createSpecialty = async (req, res) => {
  try {
    let info = await specialtyAPIService.createSpecialty(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
const updateFunc = async (req, res) => {
  try {
    let data = await specialtyAPIService.updateSpecialty(req.body);
    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
const deleteFunc = async (req, res) => {
  try {
    console.log("check req.body delete func >>>> ", req.body.id);
    let data = await specialtyAPIService.deleteSpecialty(req.body.id);
    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

const fetchAllSpecialOfSupport = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await specialtyAPIService.fetchAllSpecialOfSupport(
        +page,
        +limit
      );
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await specialtyAPIService.getAllSpecialties();
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.error("check readFunc: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
const searchSpecial = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let search = req.query.search;
    console.log("c >>>", page, limit);

    let data = await specialtyAPIService.searchSpecial(search, +page, +limit);

    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.error("check readFunc: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
module.exports = {
  createSpecialty: createSpecialty,
  readFunc,
  updateFunc,
  deleteFunc,
  fetchAllSpecialOfSupport,
  getTopSpecialtyHome,
  searchSpecial
};
