//Huyen
import db from "../models/index.js"; //connectdb
const sequelize = require("sequelize");
const { Op } = require("sequelize");

//Huyên: Lấy tên với ảnh chuyên khoa hiển thị thôi
const getTopSpecialty = async (limit) => {
  try {
    const specialties = await db.Specialties.findAll({
      limit: limit,
      attributes: ["id", "image", "nameVI", "nameEN"],
      order: [["id", "DESC"]],
    });

    return {
      EM: "get top specialties succeed!!!",
      EC: "0",
      DT: specialties,
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

const getSpecialtyWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Specialties.findAndCountAll({
      offset: offset,
      limit: limit,

      order: [["id", "DESC"]],
    });
    //count tổng số bảng ghi, rows là mảng các phần tử
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      specialties: rows,
    };
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

const getAllSpecialties = async () => {
  try {
    let specialty = await db.Specialties.findAll();

    if (specialty) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: specialty,
      };
    }
    return {
      EM: "get data fail",
      EC: "-1",
      DT: [],
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

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameVI || !data.nameEN) {
        resolve({
          EM: "Missing parameter",
          EC: 1,
          ED: "",
        });
      } else {
        let findSpecial = await db.Specialties.findOne({
          where: {
            [Op.or]: [
              {
                nameVI: {
                  [Op.like]: "%" + data.name + "%",
                },
              },
              {
                nameEN: {
                  [Op.like]: "%" + data.name + "%",
                },
              },
            ],
          },
          raw: true,
        });
        if (!findSpecial) {
          await db.Specialties.create({
            image: data.image || "",
            nameVI: data.nameVI,
            descriptionHTML_VI: data.descriptionHTML_VI,
            descriptionMarkdown_VI: data.descriptionMarkdown_VI,
            nameEN: data.nameEN,
            descriptionHTML_EN: data.descriptionHTML_EN,
            descriptionMarkdown_EN: data.descriptionMarkdown_EN,
          });
          resolve({
            EC: 0,
            EM: "create specialty succeeds!!!",
          });
        }
        resolve({
          EC: 1,
          EM: "Tồn tại Speccal!!!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
const updateSpecialty = async (Specialty) => {
  try {
    console.log("check specialty >>>", Specialty);

    let findSpecialty = await db.Specialties.findOne({
      where: { id: Specialty.id },
    });
    if (findSpecialty) {
      findSpecialty.set(Specialty);
      await findSpecialty.save();
      return {
        EM: "Update success",
        EC: "0",
        DT: "",
      };
    }
    return {
      EM: "Not find or something error",
      EC: "1",
      DT: "",
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
const deleteSpecialty = async (id) => {
  try {
    const specialty = await db.Specialties.findOne({ where: { id: id } });

    if (specialty) {
      await specialty.destroy();
      return {
        EM: "Delete successfully",
        EC: "0",
        DT: [],
      };
    } else {
      return {
        EM: "No Specialty find",
        EC: "1",
        DT: [],
      };
    }
  } catch (e) {
    console.log("error from service delete: >>>", e);
    return {
      EM: "Something wrong ...",
      EC: "-2",
      DT: "",
    };
  }
};

const fetchAllSpecialOfSupport = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Specialties.findAndCountAll({
      offset: offset,
      // limit: limit,
      include: [
        {
          model: db.Users,
          attributes: ['image'],
        },
      ],

      attributes: [
        "id",
        "nameVI",
        "nameEN",
        "image",
        "descriptionMarkdown_EN",
        "descriptionMarkdown_VI",

        [sequelize.fn("COUNT", sequelize.col("Users.id")), "userCount"],
      ],
      // having: sequelize.where([sequelize.fn('[COUNT', sequelize.col('Users.id'))]
      // ),
      group: ["Specialties.id"],
      order: [["id", "DESC"]],
    });
    //count tổng số bảng ghi, rows là mảng các phần tử
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      specialties: rows,
    };
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
const searchSpecial = async (search, page, limit) => {
  try {
    console.log("check page and limit >>>", page, limit, search);
    if (page && limit && search != "") {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.Specialties.findAndCountAll({
        offset: offset,
        // limit: limit,

        where: {
          [Op.or]: [
            {
              nameVI: {
                // [Op.like]: `%${search}`
                [Op.like]: `%${search}%`,
              },
            },
            {
              nameEN: {
                // [Op.like]: `%${search}`
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        include: [
          {
            model: db.Users,
            attributes: [],
          },
        ],

        attributes: [
          "id",
          "nameVI",
          "nameEN",
          [sequelize.fn("COUNT", sequelize.col("Users.id")), "userCount"],
        ],
        // having: sequelize.where([sequelize.fn('[COUNT', sequelize.col('Users.id'))]
        // ),
        group: ["Specialties.id"],

        order: [["id", "DESC"]],
      });
      //count tổng số bảng ghi, rows là mảng các phần tử
      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        listSpecialties: rows,
      };
      return {
        EM: "create page successfully",
        EC: "0",
        DT: data,
      };
    }
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
  createSpecialty: createSpecialty,
  getSpecialtyWithPagination,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty,
  fetchAllSpecialOfSupport,
  getTopSpecialty,
  searchSpecial,
};
