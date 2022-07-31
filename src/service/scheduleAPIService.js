//Huyên
import db from "../models/index.js"; //connectdb
import { Op, fn, col, where } from "sequelize";
import _ from "lodash";
import moment from "moment";

// //kiểm tra bác sĩ có active chưa
// let isActive = (user) => {
//   if (user.active === 0) return false;
//   return true;
// };

// //kiểm tra bác sĩ có clinic ko
// let hasClinic = (user) => {
//   if (!user.clinicId) return false;
//   return true;
// };

//kiểm tra bác sĩ có active chưa
// if (!isActive(user)) {
//   return {
//     EM: "doctor is not active",
//     EC: "1",
//     DT: "",
//   };
// }

//kiểm tra bác sĩ có clinic ko
// if (!hasClinic(user)) {
//   return {
//     EM: "doctor don't have clinic",
//     EC: "2",
//     DT: "",
//   };
// }

const createSchedule = async (data) => {
  try {
    //tìm user là bác sĩ gửi request
    let user = await db.Users.findOne({
      where: { email: data.email },
    });

    //kiểm tra user gửi request có đúng là bác sĩ không
    if (user && user.groupId === data.groupWithRoles.id) {
      //lấy ra kế hoạch cần tìm trong 1 ngày chỉ đỉnh
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
      //Nếu có kế hoạch cần tìm trong ngày chỉ định thì cập nhật, không thì thêm mới kế hoạch
      if (foundSchedule) {
        //1 kế hoạch có nhiều giờ khám
        //lấy ra các giờ khám bằng id của foundSchedule
        let foundScheduleDetail = await db.Schedule_Detail.findAll({
          attributes: ["timeframeId", "maxNumber", "currentNumber"],
          where: {
            scheduleId: foundSchedule.id,
          },
          raw: true,
        });

        // console.log("==============================================");
        // console.log(data.timeDetail);
        // console.log("==============================================");

        //kiểm tra kế hoạch giờ khám nào ko, nếu có thì cập nhật, ko có thì thêm giờ khám vào kế hoạch
        if (foundScheduleDetail && foundScheduleDetail.length > 0) {
          //các giờ khám của kế hoạch trong DB
          let timeDetailDB = [...foundScheduleDetail];

          //các giờ khám của kế hoạch dc gửi phía client
          let timeDetailRequest = [...data.timeDetail];

          //lấy ra mảng các giờ khám trong timeDetailRequest không có trong timeDetailDB
          let differenceTimeId = _.differenceWith(
            timeDetailRequest,
            timeDetailDB,
            (a, b) => {
              return a.timeframeId === b.timeframeId;
            }
          );

          //lấy ra mảng các maxNumber trong timeDetailRequest không có trong timeDetailDB
          let differenceMaxNumber = _.differenceWith(
            timeDetailRequest,
            timeDetailDB,
            (a, b) => {
              return a.maxNumber === b.maxNumber;
            }
          );

          // console.log("timeDetailDB", timeDetailDB[0].maxNumber);

          //nếu có mảng differenceTimeId thì chỉ thêm các giờ khám của mảng differenceTimeId
          if (differenceTimeId && differenceTimeId.length > 0) {
            let scheduleDetailList = [...differenceTimeId];
            scheduleDetailList.forEach(function (item) {
              item.scheduleId = foundSchedule.id;
            });
            await db.Schedule_Detail.bulkCreate(scheduleDetailList);
          }

          //nếu có mảng differenceMaxNumber thì cập nhật maxNumber của differenceMaxNumber
          if (differenceMaxNumber && differenceMaxNumber.length > 0) {
            if (
              timeDetailDB[0].currentNumber <= timeDetailRequest[0].maxNumber
            ) {
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
            } else {
              return {
                EM: "The updating number is lower than currentNumber",
                EC: "2",
                DT: "",
              };
            }
          }
          return {
            EM: "add schedule detail succeeds!!!",
            EC: "0",
            DT: "",
          };
        } else {
          //copy mảng timeDetail và gắn thêm scheduleId vào mỗi item trong scheduleDetailList
          let scheduleDetailList = [...data.timeDetail];
          scheduleDetailList.forEach(function (item) {
            item.scheduleId = foundSchedule.id;
          });

          //tạo scheduleDetail
          await db.Schedule_Detail.bulkCreate(scheduleDetailList);
          return {
            EM: "add schedule detail succeeds!!!",
            EC: "0",
            DT: "",
          };
        }
      } else {
        //tạo kế hoạch nếu tìm thấy bác sĩ
        let schedule = await db.Schedules.create({
          date: data.date,
          timestamp: data.date,
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

//cho trang chi tiết
const getSchedule = async (doctorId, date, clinicId) => {
  try {
    console.log("date", date);
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

//Lấy tất cả danh sách kế hoạch + giờ khám khả dụng
const getCurrentSchedule = async (doctorId, clinicId) => {
  try {
    console.log(moment(new Date()).format("YYYY-MM-DD"));
    let scheduleRes = await db.Schedules.findAll({
      where: [
        {
          doctorId: doctorId,
          clinicId: clinicId,
          date: {
            [Op.gte]: moment(new Date()).format("YYYY-MM-DD"),
          },
        },
      ],

      attributes: ["id", "doctorId", "date", "clinicId"],
      raw: false,
      nest: true,
      include: [
        {
          model: db.Schedule_Detail,
          attributes: ["id", "currentNumber", "maxNumber"],
          where: {
            maxNumber: {
              [Op.gt]: col("Schedule_Details.currentNumber"),
            },
          },
          include: {
            model: db.Timeframes,
            attributes: ["id", "nameEN", "nameVI"],
          },
        },
      ],
      order: [["date", "DESC"]],
    });
    //console.log("scheduleRes", scheduleRes);
    if (scheduleRes) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: scheduleRes,
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

//lấy danh sách giờ khám cho scheduleModal
const getScheduleDetail = async (scheduleId) => {
  try {
    let scheduleDetail = await db.Schedule_Detail.findAll({
      where: { scheduleId: scheduleId },
      include: [
        {
          model: db.Timeframes,
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
        EM: "There's nothing in this schedule",
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

const readSchedule = async (doctorId) => {
  try {
    let scheduleDetail = await db.Schedules.findAll({
      where: { doctorId: doctorId },
      include: [
        {
          model: db.Schedule_Detail,
          attributes: ["id", "currentNumber", "maxNumber"],
          include: [
            {
              model: db.Timeframes,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
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

//hàm cập nhật số lượng khám bệnh
const updateSchedule = async (scheduleId, maxNumber) => {
  try {
    let scheduleDetail = await db.Schedule_Detail.findOne({
      attributes: ["currentNumber"],
      where: { scheduleId: scheduleId },
    });

    if (scheduleDetail) {
      console.log("updateSchedule", scheduleDetail);
      if (scheduleDetail.currentNumber <= maxNumber) {
        let res = await db.Schedule_Detail.update(
          {
            maxNumber: maxNumber,
          },
          {
            where: {
              scheduleId: scheduleId,
            },
          }
        );
        if (res) {
          return {
            EM: "update max number succeed!!!",
            EC: "0",
            DT: res,
          };
        }
      } else {
        return {
          EM: "The updating number is lower than currentNumber",
          EC: "2",
          DT: "",
        };
      }
    } else {
      return {
        EM: "Not found schedule...",
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

const deleteSchedule = async (scheduleId) => {
  try {
    let schedule = await db.Schedules.findOne({
      attributes: ["id"],
      where: { id: scheduleId },
      include: [
        {
          model: db.Schedule_Detail,
          attributes: [
            "id",
            [fn("COUNT", col("Schedule_Details.Bookings.id")), "bookingCount"],
          ],
          include: [
            {
              model: db.Bookings,
              attributes: [],
            },
          ],
        },
      ],
      group: ["Schedules`.`id", "Schedule_Details.id"],
    });
    if (schedule) {
      //Nếu kế hoạch không có thời gian thì xóa luôn kế hoạch
      if (schedule.Schedule_Details && schedule.Schedule_Details.length === 0) {
        await schedule.destroy();
        return {
          EM: "delete schedule succeed!!!",
          EC: "0",
          DT: "",
        };
      } else if (schedule.Schedule_Details.length > 0) {
        // Nếu kế hoạch có thời gian thì kiểm tra từng thời gian
        //console.log("Cần kiểm tra thời gian nè");

        let needDelete = [];
        for (const item of schedule.Schedule_Details) {
          if (item.dataValues.bookingCount === 0) {
            needDelete.push(item.dataValues.id);
          }
        }

        //Xóa các thời gian trong needDelete nếu có.
        //Nếu needDelete có thì xóa các thời gian có trong needDelete và thông báo chỉ xóa 1 phần
        //Nếu needDelete không có thì thông báo không thể xóa
        if (needDelete && needDelete.length === 0) {
          console.log("Không thể xóa");
          return {
            EM: "Can not delete!!!",
            EC: "2",
            DT: "",
          };
        } else if (
          needDelete &&
          needDelete.length === schedule.Schedule_Details.length
        ) {
          console.log("Xóa hết time");
          console.log("needDelete", needDelete, needDelete.length);
          //nếu mảng cần xóa có length =  mảng trước đó => xóa hết time và xóa schedule

          await db.Schedule_Detail.destroy({
            where: { id: { [Op.in]: needDelete } },
          });
          console.log("Xóa schedule");
          await schedule.destroy();
          return {
            EM: "delete completely!!!",
            EC: "0",
            DT: "",
          };
        } else if (
          needDelete &&
          needDelete.length !== schedule.Schedule_Details.length
        ) {
          console.log("Xóa 1 phần time", needDelete, needDelete.length);
          await db.Schedule_Detail.destroy({
            where: { id: { [Op.in]: needDelete } },
          });
          return {
            EM: "Just delete a part of schedule!!!",
            EC: "3",
            DT: "",
          };
        }
      }
    } else {
      return {
        EM: "Schedule not found",
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

const deleteTime = async (scheduleDetailId) => {
  try {
    let scheduleDetail = await db.Schedule_Detail.findOne({
      where: { id: scheduleDetailId },
    });
    if (scheduleDetail) {
      let bookings = await db.Bookings.findAndCountAll({
        where: {
          scheduleDetailId: scheduleDetailId,
        },
      });
      if (bookings && +bookings.count !== 0) {
        return {
          EM: "Can't delete!!! This time have appointment",
          EC: "2",
          DT: "",
        };
      }
      await scheduleDetail.destroy();
      return {
        EM: "Delete data succeed!!!",
        EC: "0",
        DT: "",
      };
    } else {
      return {
        EM: "Schedule detail not found...",
        EC: "1",
        DT: "",
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

module.exports = {
  createSchedule,
  readSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
  deleteTime,
  getScheduleDetail,
  getCurrentSchedule,
};
