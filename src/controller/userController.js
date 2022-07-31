import userApiServices from "../service/userAPIServices";
import jwt from "jsonwebtoken";
const readFunc = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    console.log("c >>>", page, limit)

    let data = await userApiServices.getUserWithPagination(+page, +limit);

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
const createFunc = async (req, res) => {
  try {
    //check validate
    let data = await userApiServices.createUser(req.body);
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
    let data = await userApiServices.updateUser(req.body);
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
    let data = await userApiServices.deleteUser(req.body.id);
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
const getUserAccount = async (req, res) => {
  try {
    let data = {
      EC: 2,
      EM: "data trống",
      DT: {},
    };

    let cookies = req.cookies; //lấy cookie từ client
    if (cookies && cookies.jwt) {
      let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
      data = await userApiServices.getUserAccount(token);
    }
    return res.status(200).json({
      EM: data.EM, //error
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

const updateInforUser = async (req, res) => {
  try {
    let data = await userApiServices.updateInforUser(req.body);
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

const forgotPasswordUser = async (req, res) => {
  try {
    let data = await userApiServices.forgotPasswordUser(req.body);
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
const resetPassword = async (req, res) => {
  try {

    let data = await userApiServices.resetPassword(req.body);
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

const updatePassword = async (req, res) => {
  try {
    let data = await userApiServices.updatePassword(req.body);
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

const getUserById = async (req, res) => {
  try {
    let id = req.query.id;
    let data = await userApiServices.getUserById(id);
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
const searchUser = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    let search = req.query.search;
    console.log("c >>>", page, limit)

    let data = await userApiServices.searchUser(search, +page, +limit);

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
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  getUserAccount,
  updateInforUser,
  forgotPasswordUser,
  resetPassword,
  updatePassword,
  getUserById,
  searchUser
};
