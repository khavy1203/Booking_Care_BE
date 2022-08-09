import clinicApiServices from "../service/clinicApiServices";
import jwt from "jsonwebtoken";

const getTopClinicHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let clinics = await clinicApiServices.getTopClinic(+limit);
    return res.status(200).json(clinics);
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
      let data = await clinicApiServices.getClinicWithPagination(+page, +limit);
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await clinicApiServices.getAllClinics();
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
const createFunc = async (req, res) => {
  try {
    //check validate
    let data = await clinicApiServices.createClinic(req.body);
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
const updateFunc = async (req, res) => {
  try {
    let data = await clinicApiServices.updateClinic(req.body);
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
    let data = await clinicApiServices.deleteClinic(req.body.id);
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

const fetchDoctorOfCLinic = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let idClinic = req.query.id;
      console.log("check page, id ,limit >>", page, limit, idClinic);
      let data = await clinicApiServices.fetchDoctorOfCLinic(
        +page,
        +limit,
        +idClinic
      );
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await clinicApiServices.getAllClinics();
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
const getInforClininicOfUserOnPage = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let province = req.query.province;
      let district = req.query.district;
      let ward = req.query.ward;
      let data = await clinicApiServices.getInforClininicOfUserOnPage(
        +page,
        +limit,
        +province,
        +district,
        +ward
      );
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await clinicApiServices.getAllClinics();
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

const getClinic = async (req, res) => {
  try {
    let id = req.query.id;
    console.log("check id >> ", id);
    let data = await clinicApiServices.getClinic(id);
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

const fetchAllClinicsOfSupport = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await clinicApiServices.fetchAllClinicsOfSupport(
        +page,
        +limit
      );
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await clinicApiServices.getAllClinics();
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

const searchClinic = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let search = req.query.search;
    console.log("c >>>", page, limit);

    let data = await clinicApiServices.searchClinic(search, +page, +limit);

    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  fetchDoctorOfCLinic,
  getInforClininicOfUserOnPage,
  getClinic,
  fetchAllClinicsOfSupport,
  getTopClinicHome,
  searchClinic
};
