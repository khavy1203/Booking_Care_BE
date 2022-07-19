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

const getAllDoctors = async (page, limit, specialtyId) => {
  try {
    let offset = (page - 1) * limit;
    let data = {};
    if (specialtyId) {
      const { count, rows } = await db.Users.findAndCountAll({
        offset: offset,
        limit: limit,
        where: {
          groupId: 2,
          specialtyId: specialtyId
        },
        attributes: {
          exclude: ["password"],
        },
        include: [{
          model: db.Doctorinfo,
          attributes: ["id", "active", "price", "degree_VI", "degree_EN"],
          where: {
            active: 1,
          }
        },
        {
          model: db.Specialties,
          attributes: ["id", "nameVI", "nameEN", "image"],

        },
        {
          model: db.Clinics,
          attributes: ["id", "status", "nameVI", "nameEN", "provinceId", "districtId", "wardId", "addressVI", "addressEN"],
          where: {
            status: 1,
          }
        },
        ],
        order: [["id", "DESC"]],
        raw: true

      });
      //count tổng số bảng ghi, rows là mảng các phần tử
      let totalPages = Math.ceil(count / limit);
      data = {
        totalRows: count,
        totalPages: totalPages,
        doctors: rows,
      };
    }
    else {
      const { count, rows } = await db.Users.findAndCountAll({
        offset: offset,
        limit: limit,
        where: {
          groupId: 2,
        },
        attributes: {
          exclude: ["password"],
        },
        include: [{
          model: db.Doctorinfo,
          attributes: ["id", "active", "price", "degree_VI", "degree_EN"],
          where: {
            active: 1,
          }
        },
        {
          model: db.Specialties,
          attributes: ["id", "nameVI", "nameEN", "image"],

        },
        {
          model: db.Clinics,
          attributes: ["id", "status", "nameVI", "nameEN", "provinceId", "districtId", "wardId", "addressVI", "addressEN"],
          where: {
            status: 1,
          }
        },
        ],
        order: [["id", "DESC"]],
        raw: true

      });
      //count tổng số bảng ghi, rows là mảng các phần tử
      let totalPages = Math.ceil(count / limit);
      data = {
        totalRows: count,
        totalPages: totalPages,
        doctors: rows,
      };
    }

    return {
      EM: "create page successfully",
      EC: "0",
      DT: data,
    };
  } catch (e) {
    console.log("error from service : >>>", e);
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
  getAllDoctors
};
