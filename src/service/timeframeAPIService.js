//Huyên
import db from "../models/index.js"; //connectdb

const getAllTimes = async () => {
  try {
    let times = await db.Timeframes.findAll();
    if (times && times.length > 0) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: times,
      };
    }
    return {
      EM: "get data fail",
      EC: "-1",
      DT: [],
    };
  } catch (error) {
    console.log("error from service : >>>", error);
    return {
      EM: "Something wrong ...",
      EC: "-2",
      DT: "",
    };
  }
};

module.exports = { getAllTimes };
