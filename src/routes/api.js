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

import clinicController from "../controller/clinicController";
import provinceController from "../controller/provinceController";
import passport from "passport";
import bookingController from "../controller/bookingController";
import partnerController from "../controller/partnerController";
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
  routes.get("/user/account", userController.getUserAccount);
  routes.put("/user/updateInforUser", userController.updateInforUser);
  routes.post("/user/forgotPasswordUser", userController.forgotPasswordUser);
  routes.put("/user/updatepassword", userController.updatePassword);
  routes.get("/user/getUserById", userController.getUserById);
  routes.get("/user/searchUser", userController.searchUser);



  routes.post("/reset-password", userController.resetPassword);

  // routes.get("/account", userController.getUserAccount);

  routes.get("/group/read", groupController.readFunc);
  routes.post("/group/createGroup", groupController.createGroup);

  //huyên: doctor router
  routes.get("/top-doctor-home", doctorController.getTopDoctorHome);
  routes.get("/doctor-detail", doctorController.getInfoDoctor);
  routes.get(`/doctor-modal`, doctorController.getInfoDoctorModal);
  routes.get(`/doctor/getAllDoctors`, doctorController.getAllDoctors);

  //huyên: schedule router

  routes.get("/schedule-detail", scheduleController.getSchedule);
  routes.post("/schedule/create", scheduleController.createFunc);
  routes.get("/schedule/read", scheduleController.readFunc);
  routes.get(
    "/schedule/get-schedule-detail",
    scheduleController.getScheduleDetail
  );

  routes.get(
    "/schedule/get-current-schedule",
    scheduleController.getCurrentSchedule
  );
  routes.put("/schedule/update", scheduleController.updateFunc);
  routes.delete(
    "/schedule/schedule-delete",
    scheduleController.deleteScheduleFunc
  );
  routes.delete("/schedule/time-delete", scheduleController.deleteTimeFunc);

  //huyên: timeframe router
  routes.get("/timeframe/read", timeframeController.readFunc);

  //role router
  routes.post("/role/create", roleController.createFunc);
  routes.get("/role/read", roleController.readFunc);
  routes.delete("/role/delete", roleController.deleteFunc);
  routes.get("/role/by-group/:groupId", roleController.getRoleByGroup);
  routes.post("/role/assign-to-group", roleController.assignRoleToGroup);

  //huyên: booking routes
  routes.post("/booking/create", bookingController.createFunc);
  routes.get("/booking/partner-read", bookingController.partnerReadFunc);
  routes.get("/booking/doctor-read", bookingController.doctorReadFunc);
  routes.get("/booking/patient-read", bookingController.patientReadFunc);
  routes.put("/booking/update", bookingController.updateFunc); //hàm update chỉ là cập nhật trạng thá
  routes.put("/booking/change-booking", bookingController.changeBookingFunc); //hàm update chỉ là cập nhật trạng thái

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

  //huyên: dùng cho trang chủ
  routes.get("/top-specialty-home", specialtyController.getTopSpecialtyHome);

  routes.get("/specialty/read", specialtyController.readFunc);
  routes.post("/specialty/create", specialtyController.createSpecialty);
  routes.put("/specialty/update", specialtyController.updateFunc);
  routes.delete("/specialty/delete", specialtyController.deleteFunc);
  routes.get(
    "/specialty/fetchAllSpecialOfSupport",
    specialtyController.fetchAllSpecialOfSupport
  );
  routes.get("/specialty/searchSpecial", specialtyController.searchSpecial);

  //clinic
  routes.get("/top-clinic-home", clinicController.getTopClinicHome);

  routes.get("/clinic/read", clinicController.readFunc);
  routes.post("/clinic/create", clinicController.createFunc);
  routes.put("/clinic/update", clinicController.updateFunc);
  routes.delete("/clinic/delete", clinicController.deleteFunc);
  routes.get("/clinic/getClinic", clinicController.getClinic);
  routes.get(
    "/clinic/fetchAllClinicsOfSupport",
    clinicController.fetchAllClinicsOfSupport
  );

  routes.get("/clinic/searchClinic", clinicController.searchClinic);


  routes.get("/doctor-page", clinicController.fetchDoctorOfCLinic);
  routes.get("/clinic-page", clinicController.getInforClininicOfUserOnPage);

  //partner
  routes.post("/partner/registerClinic", partnerController.registerClinicFunc);
  routes.post(
    "/partner/registerDoctorClinic",
    partnerController.registerDoctorClinic
  );
  routes.get("/partner/getStatusClinic", partnerController.getStatusClinic);
  routes.get("/partner/getSpecialty", partnerController.getSpecialty);
  routes.get(
    "/partner/getDoctorsOfClinic",
    partnerController.getDoctorsOfClinic
  );
  routes.post(
    "/partner/deleteDoctorOfClinic",
    partnerController.deleteDoctorOfClinic
  );
  routes.post(
    "/partner/updateDoctorOfClinic",
    partnerController.updateDoctorOfClinic
  );
  routes.post(
    "/partner/addImformationClinic",
    partnerController.addImformationClinic
  );

  //province
  routes.get("/provinces/read", provinceController.readFunc);

  return app.use("/api/v1/", routes);
};
export default initApiRoutes;
