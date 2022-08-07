//huyên
import db from "../models/index.js";
import { Op } from "sequelize";
import _, { update } from "lodash";
import moment from "moment";
const createBooking = async (data) => {
  try {
    let foundScheduleDetail = await db.Schedule_Detail.findOne({
      where: { id: data.scheduleDetailId },
    });

    //có thể bác sĩ xóa đúng lúc bệnh nhân đang đặt => kiểm tra tồn tại cái giờ khám
    if (foundScheduleDetail) {
      if (+foundScheduleDetail.maxNumber > +foundScheduleDetail.currentNumber) {
        if (
          !data.doctorId ||
          !data.scheduleDetailId ||
          !data.date ||
          !data.reason ||
          !data.patientId ||
          !data.clinicId
        ) {
          return {
            EM: `Missing parameter`,
            EC: "2",
            DT: "",
          };
        }
        //tạo lịch khám
        //tìm xem có booking nào mà bệnh nhân đặt trong cùng ngày cùng bác sĩ ko, nếu có thì ko dc đặt, ngược lại thì dc
        let result = await db.Bookings.findOrCreate({
          where: {
            [Op.and]: {
              patientId: data.patientId,
              doctorId: data.doctorId,
              date: data.date,
            },
          },
          defaults: {
            statusId: 1,
            patientId: data.patientId,
            doctorId: data.doctorId,
            date: data.date,
            reason: data.reason,
            scheduleDetailId: data.scheduleDetailId,
            clinicId: data.clinicId,
          },
        });

        //console.log(">>>>>>>>>>>>>>>>check booking result", result[1]);
        //nếu tìm ko thấy thì tạo lịch hẹn, ko thì thông báo ko đặt dc
        //kết quả trả về của findOrCreate là array, array[1] là phân biệt find hoặc create
        if (result[1]) {
          //lấy ra giờ khám để cập nhật currentNumber

          if (foundScheduleDetail) {
            let newCurrentNumber = +foundScheduleDetail.currentNumber + 1;
            let newBookedNumber = +foundScheduleDetail.bookedNumber + 1;
            foundScheduleDetail.set({
              currentNumber: newCurrentNumber,
              bookedNumber: newBookedNumber,
            });
            await foundScheduleDetail.save();
          }

          return {
            EM: `Create booking succeeds!!!`,
            EC: 0,
            DT: result,
          };
        } else {
          return {
            EM: `You already booked an appointment for this date, please book another date!!!`,
            EC: "4",
            DT: "",
          };
        }
      } else {
        return {
          EM: "This time is full!!!",
          EC: "3",
          DT: "",
        };
      }
    }

    return {
      EM: "Chosen time is not exist, maybe it was deleted",
      EC: "1",
      DT: "",
    };
  } catch (error) {
    console.log("check error create booking >>>", error);
    return {
      EM: "Something wrong ...",
      EC: "-2",
      DT: "",
    };
  }
};

const partnerReadBooking = async (partner, selectedTab) => {
  try {
    let bookings = await db.Bookings.findAndCountAll({
      where: {
        statusId: selectedTab,
        clinicId: partner.Clinic,
      },
      include: [
        {
          model: db.Bookingstatus,
          attributes: ["nameEN", "nameVI"],
        },
        {
          model: db.Users,
          as: "Patient",
          attributes: ["id", "username", "phone", "email", "address"],
        },
        {
          model: db.Users,
          as: "Doctor",
          attributes: ["id", "username"],
          include: [
            {
              model: db.Doctorinfo,
              attributes: ["degree_VI", "degree_EN"],
            },
            {
              model: db.Specialties,
              attributes: ["nameVI", "nameEN"],
            },
          ],
        },
        {
          model: db.Clinics,
          attributes: ["nameVI", "nameEN"],
        },
        {
          model: db.Schedule_Detail,
          attributes: ["id"],
          include: {
            model: db.Timeframes,
            attributes: ["nameEN", "nameVI"],
          },
        },
      ],
      order: [["date", "DESC"]],
    });

    if (bookings) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: bookings,
      };
    }
    return {
      EM: "get data fail",
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

const doctorReadBooking = async (date, doctorId) => {
  try {
    let bookings = await db.Bookings.findAll({
      attributes: ["id", "reason", "date", "statusId"],
      where: {
        [Op.and]: {
          doctorId: doctorId,
          date: moment(date).format("YYYY-MM-DD"),
          statusId: { [Op.in]: [4, 5, 6] },
        },
      },
      include: [
        {
          model: db.Bookingstatus,
          attributes: ["id", "nameEN", "nameVI"],
        },
        {
          model: db.Users,
          as: "Patient",
          attributes: [
            "id",
            "username",
            "genderId",
            "phone",
            "email",
            "address",
          ],
          include: {
            model: db.Genders,
            attributes: ["id", "nameEN", "nameVI"],
          },
        },
        {
          model: db.Schedule_Detail,
          attributes: ["id"],
          include: {
            model: db.Timeframes,
            attributes: ["nameEN", "nameVI"],
          },
        },
      ],
      order: [["date", "DESC"]],
    });

    if (bookings) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: bookings,
      };
    }
    return {
      EM: "get data fail",
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

const patientReadBooking = async (patientId) => {
  try {
    let bookings = await db.Bookings.findAndCountAll({
      where: {
        patientId: patientId,
      },
      include: [
        {
          model: db.Bookingstatus,
          attributes: ["id", "nameEN", "nameVI"],
        },
        {
          model: db.Users,
          as: "Doctor",
          attributes: ["id", "username"],
          include: [
            {
              model: db.Doctorinfo,
              attributes: ["degree_VI", "degree_EN"],
            },
            {
              model: db.Specialties,
              attributes: ["nameVI", "nameEN"],
            },
          ],
        },
        {
          model: db.Clinics,
          attributes: ["id", "nameVI", "nameEN"],
        },
        {
          model: db.Schedule_Detail,
          attributes: ["id"],
          include: [
            {
              model: db.Timeframes,
              attributes: ["id", "nameEN", "nameVI"],
            },
            {
              model: db.Schedules,
              attributes: ["id"],
            },
          ],
        },
      ],
      order: [["date", "DESC"]],
    });

    if (bookings) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: bookings,
      };
    }
    return {
      EM: "get data fail",
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

//hàm cập nhật trạng thái booking dành cho bác sĩ, đối tác
const updateBooking = async (data) => {
  console.log("kiểm tra updateBooking", data);
  try {
    let findBooking = await db.Bookings.findOne({
      where: { id: data.bookingId },
    });
    if (findBooking) {
      if (data.reqCode === 1) {
        //reqCode === 1: yêu cầu cập nhật status từ CHỜ TIẾP NHẬN -> CHỜ XÁC NHẬN
        findBooking.set({ statusId: 2 });
        let res = await findBooking.save();
        return {
          EM: "Update success",
          EC: "0",
          DT: res,
        };
      } else if (data.reqCode === 2) {
        // reqCode === 2: yêu cầu cập nhật status sang HỦY
        findBooking.set({ statusId: 3 });
        let res = await findBooking.save();
        let foundScheduleDetail = await db.Schedule_Detail.findOne({
          where: { id: findBooking.scheduleDetailId },
        });
        if (foundScheduleDetail) {
          let newCurrentNumber = +foundScheduleDetail.currentNumber - 1;
          foundScheduleDetail.set({ currentNumber: newCurrentNumber });
          await foundScheduleDetail.save();
        }
        return {
          EM: "Update success",
          EC: "0",
          DT: res,
        };
      } else if (data.reqCode === 3) {
        //reqCode === 3: yêu cầu cập nhật status từ CHỜ XÁC NHẬN -> ĐÃ XÁC NHẬN
        findBooking.set({ statusId: 4 });
        let res = await findBooking.save();
        return {
          EM: "Update success",
          EC: "0",
          DT: res,
        };
      } else if (data.reqCode === 4) {
        //reqCode === 4: yêu cầu cập nhật status từ ĐÃ XÁC NHẬN -> ĐÃ KHÁM
        findBooking.set({ statusId: 5 });
        let res = await findBooking.save();
        return {
          EM: "Update success",
          EC: "0",
          DT: res,
        };
      } else if (data.reqCode === 5) {
        //reqCode === 5: yêu cầu cập nhật status từ ĐÃ XÁC NHẬN -> kHÔNG ĐI KHÁM
        findBooking.set({ statusId: 6 });
        let res = await findBooking.save();
        return {
          EM: "Update success",
          EC: "0",
          DT: res,
        };
      }
    }
    return {
      EM: "Not find or something error",
      EC: "1",
      DT: "",
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

//hàm cập nhật trạng thái booking dành cho bác sĩ, đối tác
const changeBooking = async (patient, data) => {
  // console.log("kiểm tra changeBooking", patient, data);
  try {
    //lấy ra booking cần update
    let updateBooking = await db.Bookings.findOne({
      where: { id: data.bookingId, patientId: patient.id },
      include: {
        model: db.Schedule_Detail,
      },
    });
    if (updateBooking) {
      //Cần biết xem bệnh nhân có booking nào trước đó đã đặt vào giờ khám cần đổi trong cùng ngày hay ko
      let findBooking = await db.Bookings.findOne({
        where: {
          patientId: patient.id,
          scheduleDetailId: data.scheduleDetailId,
        },
      });
      if (!findBooking) {
        //nếu không có thì cần biết xem bệnh nhân đổi giờ khám trong cùng ngày hay đổi ngày khám

        //lấy ra scheduleDetail mới để kiểm tra currentNumber và maxNumber
        let newScheduleDetail = await db.Schedule_Detail.findOne({
          where: { id: data.scheduleDetailId },
        });
        if (newScheduleDetail) {
          if (+newScheduleDetail.currentNumber < +newScheduleDetail.maxNumber) {
            //vẫn còn chỗ nên thêm dc

            //vì updateBooking chưa cập nhật nên giảm số lượng ở scheduleDetail cũ trước
            let oldScheduleDetail = await db.Schedule_Detail.findOne({
              where: { id: updateBooking.scheduleDetailId },
            });
            if (oldScheduleDetail) {
              let newCurrentNumber = +oldScheduleDetail.currentNumber - 1;
              let newBookedNumber = +oldScheduleDetail.bookedNumber - 1;
              oldScheduleDetail.set({
                currentNumber: newCurrentNumber,
                bookedNumber: newBookedNumber,
              });
              await oldScheduleDetail.save();
            } else {
              return {
                EM: "Không có oldScheduleDetail",
                EC: "3",
                DT: "",
              };
            }

            //Cần biết bệnh nhân đổi ngày hay là đổi giờ trong cùng ngày
            if (
              moment(data.chosenDate).format("YYYY-MM-DD") ===
              moment(updateBooking.date).format("YYYY-MM-DD")
            ) {
              //Nếu cùng ngày thì đổi giờ khám thôi
              //Thay đổi scheduleDetailId mới cho updateBooking
              updateBooking.set({
                scheduleDetailId: data.scheduleDetailId,
                reason: data.reason,
              });
            } else {
              //Khác ngày thì đổi ngày và giờ
              //Cần lấy ngày dc gửi (chosenDate: ngày cần đổi) phía FE để kiểm tra xem bệnh nhân đổi ngày
              //có trùng với ngày của lịch hẹn khác của bệnh nhân đã có trong DB hay ko
              let findSameDateBooking = await db.Bookings.findOne({
                where: {
                  patientId: patient.id,
                  date: moment(data.chosenDate).format("YYYY-MM-DD"),
                },
              });
              if (!findSameDateBooking) {
                //Nếu chưa có thì cập nhật ngày và scheduleDetailId của updateBooking
                //Thay đổi scheduleDetailId và date mới cho updateBooking
                updateBooking.set({
                  scheduleDetailId: data.scheduleDetailId,
                  reason: data.reason,
                  date: data.chosenDate,
                });
              } else {
                //Nếu đã có thì thông báo không cho cập nhật
                return {
                  EM: `Bạn đã đặt lịch hẹn ngày ${moment(
                    data.chosenDate
                  ).format("DD/MM/YYYY")} trước đó, xin vui chọn ngày khác`,
                  EC: "5",
                  DT: "",
                };
              }
            }
            //Lưu lại booking cần thay đổi
            let res = await updateBooking.save();

            //tăng bookedNumber và currentNumber ở scheduleDetail mới
            newScheduleDetail.set({
              currentNumber: newScheduleDetail.currentNumber + 1,
              bookedNumber: newScheduleDetail.bookedNumber + 1,
            });
            await newScheduleDetail.save();
            //tăng bookedNumber và currentNumber ở scheduleDetail mới

            return {
              EM: "Thay dổi lịch hẹn thành công",
              EC: "0",
              DT: res,
            };
          } else {
            //đã đủ lịch hẹn nên trả về thông báo không được thêm
            return {
              EM: "Số lượng lịch hẹn vừa đạt tối đa, xin vui lòng chọn giờ khám khác",
              EC: "6",
              DT: "",
            };
          }
        } else {
          return {
            EM: "Không có newScheduleDetail",
            EC: "4",
            DT: "",
          };
        }
        return {
          EM: "Không thể chuyển sang thời gian này vì bạn đã đặt rồi...",
          EC: "2",
          DT: "",
        };
      } else {
        return {
          EM: "Không thể chuyển sang thời gian này vì bạn đã đặt rồi...",
          EC: "2",
          DT: "",
        };
      }
    }
    return {
      EM: "Not find or something error",
      EC: "1",
      DT: "",
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

module.exports = {
  createBooking,
  doctorReadBooking,
  partnerReadBooking,
  updateBooking,
  patientReadBooking,
  changeBooking,
};
