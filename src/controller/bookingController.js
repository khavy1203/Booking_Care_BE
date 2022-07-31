import bookingAPIService from "../service/bookingAPIService";
const createFunc = async (req, res) => {
  try {
    //check validate
    let data = await bookingAPIService.createBooking(req.body);
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

//hàm lấy danh sách booking dành cho hỗ trợ viên
const partnerReadFunc = async (req, res) => {
  try {
    let selectedTab = req.query.selectedTab;
    let partner = req.user;
    if (selectedTab && partner) {
      console.log("partnerReadFunc", partner, selectedTab);
      let data = await bookingAPIService.partnerReadBooking(
        partner,
        selectedTab
      );
      res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      console.log("thiếu params");
    }
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

//hàm lấy danh sách booking dành cho bác sĩ
const doctorReadFunc = async (req, res) => {
  try {
    let date = req.query.date;
    let doctorId = req.user.id;
    let data = await bookingAPIService.doctorReadBooking(date, doctorId);
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

//hàm lấy danh sách booking dành cho bệnh nhân
const patientReadFunc = async (req, res) => {
  try {
    let patientId = req.user.id;
    let data = await bookingAPIService.patientReadBooking(patientId);
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

//bệnh nhân thay đổi lịch hẹn
const changeBookingFunc = async (req, res) => {
  try {
    //console.log("updateFunc", req.body);
    let patient = req.user;
    let data = await bookingAPIService.changeBooking(patient, req.body);
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

//thay đổi trạng thái booking
const updateFunc = async (req, res) => {
  try {
    console.log("updateFunc", req.body);
    let data = await bookingAPIService.updateBooking(req.body);
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

module.exports = {
  createFunc,
  partnerReadFunc,
  doctorReadFunc,
  patientReadFunc,
  updateFunc,
  changeBookingFunc,
};
