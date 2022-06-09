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
            name: {
              [Op.notIn]: ["admin", "patient"],
            },
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
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
};
