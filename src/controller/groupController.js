import groupServices from "../service/groupService";
const readFunc = async (req, res) => {
  try {
    let data = await groupServices.getGroups();
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
let createGroup = async (req, res) => {
  try {
    let info = await groupServices.createGroup(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  readFunc,
  createGroup,
};
