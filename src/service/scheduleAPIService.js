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
      let foundSchedule = await db.Schedules.findOne({
        where: {
          [Op.and]: {
            date: data.date,
            doctorId: user.id,
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

const getSchedule = async (data) => {
  try {
    let scheduleDetail = await db.Schedules.findAll({
      where: { doctorId: data },
      raw: false,
      nest: true,
      include: {
        model: db.Schedule_Detail,
      },
    });
    if (scheduleDetail && scheduleDetail.length > 0) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: scheduleDetail,
      };
    } else if (scheduleDetail.length === 0) {
      return {
        EM: "maybe this doctor don't have a schedule...",
        EC: "1",
        DT: [],
      };
    }
    return {
      EM: "get data fail...",
      EC: "-1",
      DT: [],
    };
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
