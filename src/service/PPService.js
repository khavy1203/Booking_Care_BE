import db from "../models/index.js"; //connectdb

import { getGroupWithRole } from "./JWTService";

import { createJWT, verifyToken } from "../middleware/JWTaction";

//chưa sử dụng
const loginPPGoogle = async (userraw) => {
  try {
    let user = await db.Users.findOne({
      where: {
        googleId: userraw.id,
      },
      include: [
        {
          model: db.Clinics,
          attributes: ["id", "nameVI", "addressVI", "provinceId", "districtId", "wardId"],
          raw: true,
          nest: true
        },
        {
          model: db.Specialties,
          attributes: ["id", "nameVI"],
          raw: true,
          nest: true
        },
      ],
      raw: true,
      nest: true
    });
    console.log("check user>>>", user)
    let groupWithRoles = await getGroupWithRole(user);
    let payload = {
      email: user.email,
      username: user.username,
      groupWithRoles,
      Clinic: user.Clinic,
      Specialty: user.Specialty,
      genderId: user.genderId,
      phone: user.phone,
      address: user.address,
      image: user.image

    };
    console.log("check payload :>>>", payload);
    let token = createJWT(payload);
    return {
      EM: "ok",
      EC: "0",
      DT: {
        access_token: token,
        groupWithRoles: groupWithRoles,
        email: user.email,
        username: user.username,
        groupId: user.groupId,
        genderId: user.genderId,
        phone: user.phone,
        address: user.address,
        image: user.image

      },
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
const loginPPGithub = async (userraw) => {
  try {
    let user = await db.Users.findOne({
      where: {
        githubId: userraw.id,
      },
      include: [
        {
          model: db.Clinics,
          attributes: ["id", "nameVI", "addressVI", "provinceId", "districtId", "wardId"],
          raw: true,
          nest: true
        },
        {
          model: db.Specialties,
          attributes: ["id", "nameVI"],
          raw: true,
          nest: true
        },
      ],
      raw: true,
      nest: true
    });
    let groupWithRoles = await getGroupWithRole(user);
    let payload = {
      email: user.email,
      username: user.username,
      groupWithRoles,
      Clinic: user.Clinic,
      Specialty: user.Specialty,
      genderId: user.genderId,
      phone: user.phone,
      address: user.address,
      image: user.image

    };
    console.log("check payload :>>>", payload);
    let token = createJWT(payload);
    return {
      EM: "ok",
      EC: "0",
      DT: {
        access_token: token,
        groupWithRoles: groupWithRoles,
        email: user.email,
        username: user.username,
        groupId: user.groupId,
        clinicId: user.clinicId,
        genderId: user.genderId,
        phone: user.phone,
        address: user.address,
        image: user.image

      },
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
  loginPPGoogle,
  loginPPGithub,
};
