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

module.exports = {
  createFunc,
};
