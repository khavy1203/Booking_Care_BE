//huyên
import db from "../models/index.js";
import { Op } from "sequelize";
import _ from "lodash";
//hướng 1: bệnh nhân đặt lịch ko đăng nhập
//B1: Nếu bệnh nhân lần đầu khám ở hệ thống thì sẽ tạo mới user, nếu bệnh nhân có trong hệ thống thì lấy email để tìm
//B2: trước khi tạo lịch hẹn, kiểm tra bệnh nhân có đặt lịch hẹn cho cùng 1 bác sĩ trong cùng 1 ngày ko
//    nếu có thì thông báo ko thể tạo
//    nếu ko thì tạo lịch hẹn

const createBooking = async (data) => {
  try {
    if (
      !data.username ||
      !data.email ||
      !data.phone ||
      !data.address ||
      !data.genderId ||
      !data.doctorId ||
      !data.schedule_detail_id ||
      !data.date
    ) {
      return {
        EM: `Missing parameter`,
        EC: 1,
        DT: "",
      };
    }
    //tìm hoặc tạo user trước
    let user = await db.Users.findOrCreate({
      where: { email: data.email },
      defaults: {
        email: data.email,
        groupId: 3,
        genderId: data.genderId,
        username: data.username,
        phone: data.phone,
        address: data.address,
      },
      raw: true,
    });
    // console.log(">>>> check user", user[0]);
    //tạo đặt lịch
    if (user && user[0]) {
      //tìm xem có booking nào mà bệnh nhân đặt trong cùng ngày cùng bác sĩ ko
      let foundBooking = await db.Bookings.findAll({
        where: {
          [Op.and]: {
            patientId: user[0].id,
            doctorId: data.doctorId,
            date: data.date,
          },
        },
      });
      console.log(
        ">>>>>>>>>>>>>>>>check found booking",
        _.isEmpty(foundBooking)
      );
      //nếu tìm ko thấy thì tạo lịch hẹn, ko thì thông báo ko đặt dc
      if (_.isEmpty(foundBooking)) {
        let booking = await db.Bookings.create({
          statusId: 1,
          doctorId: data.doctorId,
          patientId: user[0].id,
          date: data.date,
          schedule_detail_id: data.schedule_detail_id,
        });
        return {
          EM: `Create booking succeeds!!!`,
          EC: 0,
          DT: booking,
        };
      } else {
        return {
          EM: `You already booked an appointment for this date, please book another date!!!`,
          EC: 2,
          DT: [],
        };
      }
    }
  } catch (error) {
    console.log("check error creatnewrole >>>", error);
    return {
      EM: "Something wrong ...",
      EC: "-2",
      DT: "",
    };
  }
};

module.exports = { createBooking };
