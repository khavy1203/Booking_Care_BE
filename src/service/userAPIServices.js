import db from "../models/index.js"; //connectdb
import {
  checkEmail,
  checkPhone,
  hashUserPassword,
} from "./loginRegisterService.js";
import jwtAction from "../middleware/JWTaction";
import { sendEmailPassword } from "./emailService";

const makeid = (length) => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Users.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: { exclude: ['password'] },
      include:
        [
          {
            model: db.Group,
            attributes: ["name", "description"]
          },
          {
            model: db.Clinics,
            attributes: ["id", "nameVI",]
          },
          {
            model: db.Specialties,
            attributes: ["id", "nameVI"]
          },
        ],
      order: [["id", "DESC"]],
    });
    //count tổng số bảng ghi, rows là mảng các phần tử
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      users: rows,
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

const getAllUsers = async () => {
  try {
    let users = await db.Users.findAll({
      attributes: { exclude: ['password'] },
      include:
        [
          {
            model: db.Group,
            attributes: ["name", "description"]
          },
          {
            model: db.Clinics,
            attributes: ["id", "nameVI",]
          },
          {
            model: db.Specialties,
            attributes: ["id", "nameVI"]
          },
        ],
      raw: true, //kiểu ob js
      nest: true, //kiểu gộp dữ liệu lại
    });

    if (users) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: users,
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

const createUser = async (data) => {
  try {
    if ((await checkEmail(data.email)) === true) {
      return {
        EM: "Email exist",
        EC: 1,
        DT: "email",
      };
    } else if ((await checkPhone(data.phone)) === true) {
      return {
        EM: "Phone exist",
        EC: 1,
        DT: "phone",
      };
    }
    let hashPassword = "";
    if (!data.password) {
      let password = makeid(6);
      hashPassword = hashUserPassword(password);
      let objEmail = {
        email: data.email,
        password: password
      }
      await sendEmailPassword(objEmail);
    }
    else {
      hashPassword = hashUserPassword(data.password);
    }

    let user = { ...data, password: hashPassword };
    await db.Users.create(user);
    return {
      EM: "create user successfully",
      EC: 0,
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

const updateUser = async (user) => {
  try {
    let findUser = await db.Users.findOne({ where: { id: user.id } });
    if (findUser) {
      findUser.set(user);
      await findUser.save();
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

const deleteUser = async (id) => {
  try {
    const user = await db.Users.findOne({ where: { id: id } });

    if (user) {
      await user.destroy();
      return {
        EM: "Delete successfully",
        EC: "0",
        DT: [],
      };
    } else {
      return {
        EM: "No user find",
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
const getUserAccount = async (jwtCookies) => {
  try {
    let decode = jwtAction.verifyToken(jwtCookies);

    if (decode) {
      console.log("check decode >>>", decode);
      return {
        EM: "Get user successfully",
        EC: 0,
        DT: {
          token: jwtCookies,
          decode: decode
        },
      };
    } else {
      return {
        EM: "Overtime JWT ",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    return {
      EM: "Something wrong ...",
      EC: "-2",
      DT: "",
    };
  }
};
module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserWithPagination,
  getUserAccount,
};
