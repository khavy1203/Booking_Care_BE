//Huyên
import timeframeApiServices from "../service/timeframeAPIService";

const readFunc = async (req, res) => {
  try {
    let data = await timeframeApiServices.getAllTimes();
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
  readFunc,
};
