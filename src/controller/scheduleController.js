//Huyên
import scheduleApiServices from "../service/scheduleAPIService";

const createFunc = async (req, res) => {
  try {
    let info = { ...req.body, ...req.user };
    // console.log("info", info);
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

const getCurrentSchedule = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;
    const clinicId = req.query.clinicId;
    if (doctorId && clinicId) {
      let data = await scheduleApiServices.getCurrentSchedule(
        doctorId,
        clinicId
      );
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

const getScheduleDetail = async (req, res) => {
  try {
    const scheduleId = req.query.scheduleId;
    if (scheduleId) {
      let data = await scheduleApiServices.getScheduleDetail(scheduleId);
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

const readFunc = async (req, res) => {
  try {
    const doctorId = req.user.id;
    console.log("req.user.id", req.user.id);
    //const clinicId = req.user.clinicId;
    if (doctorId) {
      let data = await scheduleApiServices.readSchedule(doctorId);
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      res.status(200).json({
        EM: "missing doctorId params...",
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

const updateFunc = async (req, res) => {
  try {
    const scheduleId = req.body.scheduleId;
    const maxNumber = req.body.maxNumber;
    if (scheduleId) {
      let data = await scheduleApiServices.updateSchedule(
        scheduleId,
        maxNumber
      );
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      res.status(200).json({
        EM: "missing doctorId params...",
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

const deleteScheduleFunc = async (req, res) => {
  try {
    const scheduleId = req.body.id;
    if (scheduleId) {
      let data = await scheduleApiServices.deleteSchedule(scheduleId);
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      res.status(200).json({
        EM: "missing scheduleId params...",
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

const deleteTimeFunc = async (req, res) => {
  try {
    const scheduleDetailId = req.body.id;
    //console.log("scheduleDetailId", req.body);
    if (scheduleDetailId) {
      let data = await scheduleApiServices.deleteTime(scheduleDetailId);
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      res.status(200).json({
        EM: "missing schedule detail id params...",
        EC: "1",
        DT: "",
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
  readFunc,
  getSchedule,
  deleteScheduleFunc,
  deleteTimeFunc,
  updateFunc,
  getScheduleDetail,
  getCurrentSchedule,
};
