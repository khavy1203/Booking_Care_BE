//Huyên
import scheduleApiServices from "../service/scheduleAPIService";

const createFunc = async (req, res) => {
  try {
    let info = { ...req.body, ...req.user };
    let data = await scheduleApiServices.createSchedule(info);
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
    const id = req.query.id;
    const date = req.query.date;
    const clinicId = req.query.clinicId;
    if (id && date) {
      let data = await scheduleApiServices.getSchedule(id, date, clinicId);
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      res.status(200).json({
        EM: "missing id params...",
        EC: "1",
        DT: [],
      });
    }
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
