//Huyên
import db from "../models/index.js"; //connectdb
import { Op } from "sequelize";
import _ from "lodash";

//kiểm tra bác sĩ có active chưa
let isActive = (user) => {
  if (user.active === 0) return false;
  return true;
};

//kiểm tra bác sĩ có clinic ko
let hasClinic = (user) => {
  if (!user.clinicId) return false;
  return true;
};

const createSchedule = async (data) => {
  try {
    //tìm user là bác sĩ gửi request
    let user = await db.Users.findOne({
      where: { email: data.email },
    });

    //kiểm tra user gửi request có đúng là bác sĩ không
    if (user && user.groupId === data.groupWithRoles.id) {
      //kiểm tra bác sĩ có active chưa
      if (!isActive(user)) {
        return {
          EM: "doctor is not active",
          EC: "1",
          DT: "",
        };
      }

      //kiểm tra bác sĩ có clinic ko
      if (!hasClinic(user)) {
        return {
          EM: "doctor don't have clinic",
          EC: "2",
          DT: "",
        };
      }

      //lấy ra schedule cần tìm thuộc 1 ngày của bác sĩ
      let foundSchedule = await db.Schedules.findOne({
        where: {
          [Op.and]: {
            date: data.date,
            doctorId: user.id,
            clinicId: user.clinicId,
          },
        },
      });

      // console.log(foundSchedule);
      //Nếu có tồn tại schedule của bác sĩ trong ngày cần tìm thì cập nhật, ngược lại thì thêm mới
      if (foundSchedule) {
        //lấy ra các bản ghi kế hoạch chi tiết bằng id của foundSchedule
        let foundScheduleDetail = await db.Schedule_Detail.findAll({
          attributes: ["timeframeId", "maxNumber"],
          where: {
            scheduleId: foundSchedule.id,
          },
          raw: true,
        });

        // console.log("==============================================");
        // console.log(data.timeDetail);
        // console.log("==============================================");

        //timeDetail của DB
        let timeDetailDB = [...foundScheduleDetail];

        //timeDetail dc gửi
        let timeDetailRequest = [...data.timeDetail];

        //lấy ra mảng các obj trong timeDetailRequest không có trong timeDetailDB
        let differenceTimeId = _.differenceWith(
          timeDetailRequest,
          timeDetailDB,
          (a, b) => {
            return a.timeframeId === b.timeframeId;
          }
        );

        //lấy ra mảng các obj trong timeDetailRequest không có trong timeDetailDB
        let differenceMaxNumber = _.differenceWith(
          timeDetailRequest,
          timeDetailDB,
          (a, b) => {
            return a.maxNumber === b.maxNumber;
          }
        );

        //nếu có mảng differenceTimeId thì chỉ tạo thêm các obj trong mảng đó
        if (differenceTimeId && differenceTimeId.length > 0) {
          let scheduleDetailList = [...differenceTimeId];
          scheduleDetailList.forEach(function (item) {
            item.scheduleId = foundSchedule.id;
          });
          await db.Schedule_Detail.bulkCreate(scheduleDetailList);
        }

        //nếu có mảng differenceMaxNumber thì cập nhật maxNumber
        if (differenceMaxNumber && differenceMaxNumber.length > 0) {
          await db.Schedule_Detail.update(
            {
              maxNumber: differenceMaxNumber[0].maxNumber,
            },
            {
              where: {
                scheduleId: foundSchedule.id,
              },
            }
          );
        }

        return {
          EM: "add schedule detail succeeds!!!",
          EC: "0",
          DT: "",
        };
      } else {
        //tạo dữ liệu schedule nếu tìm thấy bác sĩ
        let schedule = await db.Schedules.create({
          date: data.date,
          doctorId: user.id,
          clinicId: user.clinicId,
        });

        if (schedule) {
          //copy mảng timeDetail và gắn thêm scheduleId vào mỗi item trong scheduleDetailList
          let scheduleDetailList = [...data.timeDetail];
          scheduleDetailList.forEach(function (item) {
            item.scheduleId = schedule.id;
          });

          //tạo scheduleDetail
          await db.Schedule_Detail.bulkCreate(scheduleDetailList);
          return {
            EM: "create schedule detail succeeds!!!",
            EC: "0",
            DT: "",
          };
        } else {
          return {
            EM: "create schedule fail...",
            EC: "1",
            DT: "",
          };
        }
      }
    } else {
      return {
        EM: "User is not doctor...",
        EC: "1",
        DT: [],
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

const getSchedule = async (doctorId, date, clinicId) => {
  try {
    let scheduleDetail = await db.Schedules.findOne({
      where: { doctorId: doctorId, date: date, clinicId: clinicId },
      attributes: ["id", "doctorId", "date"],
      raw: false,
      nest: true,
      include: [
        {
          model: db.Schedule_Detail,
          attributes: ["id", "currentNumber", "maxNumber"],
          include: {
            model: db.Timeframes,
            attributes: ["nameEN", "nameVI"],

            // through: { attributes: [] }, //khắc phục lỗi dư maping
          },
        },
      ],
    });
    if (scheduleDetail) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: scheduleDetail,
      };
    } else {
      return {
        EM: "maybe this doctor has no schedule for today...",
        EC: "1",
        DT: [],
      };
    }
  } catch (error) {
    console.log("error from service : >>>", error);
    return {
      EM: "Something wrong ...",
      EC: "-2",
      DT: "",
    };
  }
};

module.exports = { createSchedule, getSchedule };
