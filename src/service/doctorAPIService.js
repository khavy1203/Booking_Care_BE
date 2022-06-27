//Huyên
import db from "../models/index";
const { Op } = require("sequelize");

const getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.Users.findAll({
        limit: limit,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: {
          model: db.Group,
          attributes: ["name"],
          where: {
            id: 2,
            // name: {
            //   [Op.notIn]: ["admin", "patient"],
            // },
          },
        },
        raw: true,
        nest: true,
      });
      resolve({
        EC: 0,
        DT: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getInfoDoctor = async (id) => {
  try {
    let doctor = await db.Users.findOne({
      attributes: {
        exclude: ["password"],
      },
      where: {
        id: id,
      },
      include: {
        model: db.Group,
        attributes: ["name"],
        where: {
          name: {
            [Op.notIn]: ["admin", "patient"],
          },
        },
      },
      raw: false,
      nest: true,
    });
    if (doctor && doctor.image) {
      doctor.image = new Buffer(doctor.image, "base64").toString("binary");
      return {
        EC: "0",
        EM: "Found the doctor!!!",
        DT: doctor,
      };
    }
    return {
      EC: "1",
      EM: "Not a doctor...",
      DT: "",
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

const getInfoDoctorModal = async (id) => {
  try {
    let doctor = await db.Users.findOne({
      attributes: ["username", "image"],
      where: {
        id: id,
      },
      include: {
        model: db.Group,
        attributes: ["name"],
        where: {
          name: {
            [Op.notIn]: ["admin", "patient"],
          },
        },
      },
      raw: false,
      nest: true,
    });
    if (doctor && doctor.image) {
      doctor.image = new Buffer(doctor.image, "base64").toString("binary");
      return {
        EC: "0",
        EM: "Found the doctor!!!",
        DT: doctor,
      };
    }
    return {
      EC: "1",
      EM: "Not a doctor...",
      DT: "",
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

module.exports = {
  getTopDoctorHome,
  getInfoDoctor,
  getInfoDoctorModal,
};
