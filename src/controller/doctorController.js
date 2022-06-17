import doctorAPIService from "../service/doctorAPIService";
const getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let doctors = await doctorAPIService.getTopDoctorHome(+limit);
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      EC: -1,
      EM: "Error from server...",
      DT: "",
    });
  }
};

const getInfoDoctor = async (req, res) => {
  try {
    let doctorId = req.query.id;

    if (doctorId) {
      let data = await doctorAPIService.getInfoDoctor(doctorId);
      res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: "missing id param", //error message
        EC: "1", //error code
        DT: "",
      });
    }
  } catch (error) {
    console.error("check error: ", error);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

const getInfoDoctorModal = async (req, res) => {
  try {
    let doctorId = req.query.id;

    if (doctorId) {
      let data = await doctorAPIService.getInfoDoctorModal(doctorId);
      res.status(200).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT,
      });
    } else {
      return res.status(200).json({
        EM: "missing id param", //error message
        EC: "1", //error code
        DT: "",
      });
    }
  } catch (error) {
    console.error("check error: ", error);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getInfoDoctor,
  getInfoDoctorModal,
};
