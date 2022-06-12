import express from "express";
import loginRegisterController from "../controller/loginRegisterController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";
import { checkUserJwt, checkUserPermission } from "../middleware/JWTaction";
import specialtyController from "../controller/specialtyController";
import doctorController from "../controller/doctorController";
import timeframeController from "../controller/timefameController";
import scheduleController from "../controller/scheduleController";

import roleController from "../controller/roleController";
import passport from "passport";
require("dotenv").config();
const routes = express.Router();

const initApiRoutes = (app) => {
  routes.all("*", checkUserJwt, checkUserPermission); //mặc định các router sẽ chạy qua 2 cái check quyền này trước rồi mới thực hiện tiếp các tác vụ bên dưới

  routes.post("/register", loginRegisterController.handleRegister);
  routes.post("/login", loginRegisterController.handleLogin);
  routes.post("/logout", loginRegisterController.logoutPPGoogle);

  //user router
  routes.get("/user/read", userController.readFunc);
  routes.post("/user/create", userController.createFunc);
  routes.put("/user/update", userController.updateFunc);
  routes.delete("/user/delete", userController.deleteFunc);
  // routes.get("/account", userController.getUserAccount);

  routes.get("/group/read", groupController.readFunc);

  //huyên: doctor router
  routes.get("/top-doctor-home", doctorController.getTopDoctorHome);
  routes.get("/doctor-detail/:id", doctorController.getInfoDoctor);

  //huyên: schedule router
  routes.post("/schedule/create", scheduleController.createFunc);
  routes.get("/schedule/get-schedule/:id", scheduleController.getSchedule);

  //huyên: timeframe router
  routes.get("/timeframe/read", timeframeController.readFunc);

  //role routes
  //role router
  routes.post("/role/create", roleController.createFunc);
  routes.get("/role/read", roleController.readFunc);
  routes.delete("/role/delete", roleController.deleteFunc);
  routes.get("/role/by-group/:groupId", roleController.getRoleByGroup);
  routes.post("/role/assign-to-group", roleController.assignRoleToGroup);

  //auth route
  //google
  routes.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  routes.get(
    "/auth/google/callback",
    passport.authenticate("google", {}),
    loginRegisterController.handleLoginPPGoogleSuccess
  ); //callback dữ liệu
  // routes.get("/google/loginsuccess", loginRegisterController.handleLoginPPGoogleSuccess);
  //github
  routes.get(
    "/github",
    passport.authenticate("github", { scope: ["profile", "email"] })
  );
  routes.get(
    "/auth/github/callback",
    passport.authenticate("github"),
    loginRegisterController.handleLoginPPGithubSuccess
  ); //callback dữ liệu

  //huyên: specialty router
  routes.get("/specialty/read", specialtyController.readSpecialty);
  // routes.post("/specialty/create", specialtyController.createSpecialty);
  // routes.put("/specialty/update", specialtyController.updateSpecialty);
  // routes.delete("/specialty/delete", specialtyController.deleteSpecialty);

  return app.use("/api/v1/", routes);
};
export default initApiRoutes;
