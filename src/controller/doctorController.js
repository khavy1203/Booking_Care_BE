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

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
};
