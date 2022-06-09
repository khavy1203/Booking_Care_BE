//Huyên
import scheduleApiServices from "../service/scheduleAPIService";

const createFunc = async (req, res) => {
  try {
    // res.status(200).json(req.body.email);
    let data = await scheduleApiServices.createSchedule(req.body);
    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("check readFunc", error);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

module.exports = {
  createFunc,
};
