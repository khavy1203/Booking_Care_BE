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
    console.log("check createFunc", error);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

const getSchedule = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("req.params.id", id);
    let data = await scheduleApiServices.getSchedule(id);
    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("check getSchedule", error);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

module.exports = {
  createFunc,
  getSchedule,
};
