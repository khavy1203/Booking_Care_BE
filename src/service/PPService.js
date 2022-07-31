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
          attributes: ['id'],
          raw: true,
          nest: true
        },
        {
          model: db.Specialties,
          attributes: ["id"],
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
      id: user.id,
      email: user.email,
      username: user.username,
      image: user.image,
      groupWithRoles,
      groupId: user.groupId,
      Clinic: user.Clinic.id,
      Specialty: user.Specialty.id,
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
          attributes: ["id"],
          raw: true,
          nest: true
        },
        {
          model: db.Specialties,
          attributes: ["id"],
          raw: true,
          nest: true
        },
      ],
      raw: true,
      nest: true
    });
    let groupWithRoles = await getGroupWithRole(user);
    let payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      image: user.image,
      groupWithRoles,
      groupId: user.groupId,
      Clinic: user.Clinic.id,
      Specialty: user.Specialty.id,
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
