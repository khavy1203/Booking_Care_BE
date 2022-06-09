//Huyên
import db from "../models/index.js"; //connectdb
import { Op } from "sequelize";
import _ from "lodash";

const createSchedule = async (data) => {
  try {
    //tìm user là bác sĩ gửi request
    let user = await db.Users.findOne({
      where: {
        [Op.and]: {
          email: data.email,
          groupId: data.groupId,
        },
      },
    });

    //kiểm tra có đúng là bác sĩ gửi request không
    if (user) {
      //lấy ra schedule cần tìm thuộc 1 ngày của bác sĩ
      let findedSchedule = await db.Schedules.findOne({
        where: {
          [Op.and]: {
            date: data.date,
            doctorId: user.id,
          },
        },
      });

      // console.log(findedSchedule);
      //Nếu có tồn tại schedule của bác sĩ trong ngày cần tìm thì cập nhật, ngược lại thì thêm mới
      if (findedSchedule) {
        //lấy ra các bản ghi kế hoạch chi tiết bằng id của findedSchedule
        let findedScheduleDetail = await db.Schedule_Detail.findAll({
          attributes: ["timeframeId", "maxNumber"],
          where: {
            scheduleId: findedSchedule.id,
          },
          raw: true,
        });

        // console.log("==============================================");
        // console.log(data.timeDetail);
        // console.log("==============================================");

        //timeDetail của DB
        let timeDetailDB = [...findedScheduleDetail];

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
            item.scheduleId = findedSchedule.id;
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
                scheduleId: findedSchedule.id,
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
        EM: "User not found...",
        EC: "1",
        DT: "",
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

module.exports = { createSchedule };
