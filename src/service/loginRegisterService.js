require("dotenv").config();
import db from "../models/index.js"; //connectdb
import bcryptjs from "bcryptjs";
import { Op } from "sequelize";
import { createJWT, verifyToken } from "../middleware/JWTaction";

const salt = bcryptjs.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  return bcryptjs.hashSync(userPassword, salt);
};
const compareUserPassword = (userPassword, hashPassword) => {
  return bcryptjs.compareSync(userPassword, hashPassword);
};

const hashUserEmail = (usermail) => {
  return bcryptjs.hashSync(usermail, salt);
};
const compareEmail = (email, hashEmail) => {
  return bcryptjs.compareSync(email, hashEmail);
};
const checkEmail = async (userEmail) => {
  let isExist = await db.Users.findOne({
    where: { email: userEmail },
  });
  if (isExist) {
    return true;
  }
  return false;
};

const checkPhone = async (userPhone) => {
  let isExist = await db.Users.findOne({
    where: { phone: userPhone },
  });
  if (isExist) {
    return true;
  }
  return false;
};

const registerNewUser = async (rawUserData) => {
  try {
    //check email/phone number are exist
    let emailExists = await checkEmail(rawUserData.email);
    if (emailExists === true) {
      return {
        EM: "Email exist",
        EC: 1,
      };
    }
    let phoneExists = await checkPhone(rawUserData.phone);
    if (phoneExists === true) {
      return {
        EM: "Phone exist",
        EC: 1,
      };
    }
    //hash user password
    let hashPassword = hashUserPassword(rawUserData.password);
    //create new user, Huyen: thêm cột clinicId
    await db.Users.create({
      email: rawUserData.email,
      username: rawUserData.username,
      password: hashPassword,
      phone: rawUserData.phone,
      genderId: 1, //1 nam, 2 là nữ
      groupId: 3, //3 là khách hàng, 2 là admin,  1 là bác sĩ
    });
    return {
      EM: "Create new user successfully ",
      EC: "0",
    };
  } catch (e) {
    console.log("check error : ", e);
    return {
      EM: "Something wrong ...",
      EC: "-2",
    };
  }
};

const loginUser = async (rawUserAccount) => {
  try {
    let user = await db.Users.findOne({
      where: {
        [Op.or]: [
          { email: rawUserAccount.account },
          { phone: rawUserAccount.account },
        ],
      },
      include: [
        {
          model: db.Clinics,
          attributes: ["id"],
          raw: true,
          nest: true,
        },
        {
          model: db.Specialties,
          attributes: ["id", "nameVI"],
          raw: true,
          nest: true,
        },
      ],
      raw: true,
      nest: true,
    });
    if (user) {
      console.log("found user", user);
      let isCorrectPassword = compareUserPassword(
        rawUserAccount.password,
        user.password
      );
      if (isCorrectPassword === true) {
        //test roles
        let payload = {
          id: user.id,
          email: user.email,
          username: user.username,
          image: user.image,
          groupId: user.groupId,
          Clinic: user.Clinic.id,
          Specialty: user.Specialty.id,
          phone: user.phone,
        };
        console.log("check payload :>>>", payload);
        let token = createJWT(payload);
        return {
          EM: "ok",
          EC: "0",
          DT: {
            access_token: token,
          },
        };
      }
    }
    return {
      EM: "Your email/phone number or password is incorrect",
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
module.exports = {
  registerNewUser,
  loginUser,
  checkEmail,
  checkPhone,
  hashUserPassword,
  compareUserPassword,
  hashUserEmail,
  compareEmail,
};
