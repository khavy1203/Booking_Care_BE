import db from "../models/index.js"; //connectdb
import loginRegisterService from "./loginRegisterService.js";

//Huyên: Lấy tên với ảnh phòng khám hiển thị thôi
const getTopClinic = async (limit) => {
  try {
    const clinics = await db.Clinics.findAll({
      limit: limit,
      attributes: ["id", "image", "nameVI", "nameEN"],
      order: [["id", "DESC"]],
    });

    return {
      EM: "get top clinics succeed!!!",
      EC: "0",
      DT: clinics,
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

const getClinicWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Clinics.findAndCountAll({
      offset: offset,
      limit: limit,
      include: {
        model: db.Users,
        attributes: ["id", "email", "image", "groupId", "phone"],
      },
      order: [["id", "DESC"]],
    });
    //count tổng số bảng ghi, rows là mảng các phần tử
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      clinics: rows,
    };
    return {
      EM: "create page successfully",
      EC: "0",
      DT: data,
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
const getAllClinics = async () => {
  try {
    let clinics = await db.Clinics.findAll();

    if (clinics) {
      return {
        EM: "get data successfully",
        EC: "0",
        DT: clinics,
      };
    }
    return {
      EM: "get data fail",
      EC: "-1",
      DT: [],
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

const createClinic = async (Clinic) => {
  try {
    console.log("check clinic >>>", Clinic);
    // let groupId;
    // if (Clinic.status === 1) {
    //     groupId = 5;
    // } else {
    //     groupId = 3;
    // }
    await db.Clinics.create({
      Clinic,
    });
    return {
      EM: "create Clinic successfully",
      EC: 0,
      DT: "",
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

const updateClinic = async (Clinic) => {
  try {
    console.log("check clinic >>>", Clinic);

    let findClinic = await db.Clinics.findOne({ where: { id: Clinic.id } });
    if (findClinic) {
      findClinic.set(Clinic);
      await findClinic.save();
      return {
        EM: "Update success",
        EC: "0",
        DT: "",
      };
    }
    return {
      EM: "Not find or something error",
      EC: "1",
      DT: "",
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

const deleteClinic = async (id) => {
  try {
    const clinic = await db.Clinics.findOne({ where: { id: id } });

    if (clinic) {
      await clinic.destroy();
      return {
        EM: "Delete successfully",
        EC: "0",
        DT: [],
      };
    } else {
      return {
        EM: "No Clinic find",
        EC: "1",
        DT: [],
      };
    }
  } catch (e) {
    console.log("error from service delete: >>>", e);
    return {
      EM: "Something wrong ...",
      EC: "-2",
      DT: "",
    };
  }
};

const fetchDoctorOfCLinic = async (page, limit, id) => {
  try {
    let offset = (page - 1) * limit;
    const clinic = await db.Clinics.findOne({
      where: { id: id },
      include: {
        model: db.Users,
        attributes: ["id", "email", "image", "groupId", "phone"],
        where: { groupId: 5 },
      },
      raw: true,
    });
    const { count, rows } = await db.Users.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        clinicId: id,
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.Doctorinfo,
          attributes: ["id", "active", "price", "degree_VI", "degree_EN"],
          where: {
            active: 1,
          },
        },
        {
          model: db.Specialties,
          attributes: ["id", "nameVI", "nameEN", "image"],
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });
    //count tổng số bảng ghi, rows là mảng các phần tử
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      doctors: rows,
      clinic: clinic ? clinic : {},
    };
    return {
      EM: "create page successfully",
      EC: "0",
      DT: data,
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
const getInforClininicOfUserOnPage = async (
  page,
  limit,
  provinceId,
  districtId,
  wardId
) => {
  try {
    let offset = (page - 1) * limit;

    let data = [];
    if (!provinceId && !districtId && !wardId) {
      const { count, rows } = await db.Clinics.findAndCountAll({
        offset: offset,
        limit: limit,
        include: {
          model: db.Users,
          attributes: ["id", "email", "image", "groupId", "phone"],
        },
        order: [["id", "DESC"]],
        raw: true,
      });

      data = {
        totalRows: count,
        totalPages: Math.ceil(count / limit),
        clinics: rows,
      };
    }
    if (provinceId && !districtId) {
      const { count, rows } = await db.Clinics.findAndCountAll({
        offset: offset,
        limit: limit,
        include: {
          model: db.Users,
          attributes: ["id", "email", "image", "groupId", "phone"],
        },
        where: {
          provinceId: provinceId,
        },
        order: [["id", "DESC"]],
        raw: true,
      });

      data = {
        totalRows: count,
        totalPages: Math.ceil(count / limit),
        clinics: rows,
      };
    } else if (districtId && !wardId) {
      const { count, rows } = await db.Clinics.findAndCountAll({
        offset: offset,
        limit: limit,
        include: {
          model: db.Users,
          attributes: ["id", "email", "image", "groupId", "phone"],
        },
        where: {
          districtId: districtId,
        },
        order: [["id", "DESC"]],
        raw: true,
      });

      data = {
        totalRows: count,
        totalPages: Math.ceil(count / limit),
        clinics: rows,
      };
    } else if (wardId) {
      const { count, rows } = await db.Clinics.findAndCountAll({
        offset: offset,
        limit: limit,
        include: {
          model: db.Users,
          attributes: ["id", "email", "image", "groupId", "phone"],
        },
        where: {
          wardId: wardId,
        },
        order: [["id", "DESC"]],
        raw: true,
      });

      data = {
        totalRows: count,
        totalPages: Math.ceil(count / limit),
        clinics: rows,
      };
    }

    //count tổng số bảng ghi, rows là mảng các phần tử

    return {
      EM: "create page successfully",
      EC: "0",
      DT: data,
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

const getClinic = async (id) => {
  try {
    const clinic = await db.Clinics.findOne({
      where: { id: +id },
      raw: true,
    });

    if (clinic) {
      return {
        EM: "Get successfully",
        EC: "0",
        DT: clinic,
      };
    } else {
      return {
        EM: "No Clinic find",
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

const fetchAllClinicsOfSupport = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Clinics.findAndCountAll({
      offset: offset,
      limit: limit,
      include: {
        model: db.Users,
        attributes: ["id", "email", "image", "groupId", "phone"],
      },
      order: [["id", "DESC"]],
    });
    //count tổng số bảng ghi, rows là mảng các phần tử
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      clinics: rows,
    };
    return {
      EM: "create page successfully",
      EC: "0",
      DT: data,
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
  getAllClinics,
  createClinic,
  updateClinic,
  deleteClinic,
  getClinicWithPagination,
  fetchDoctorOfCLinic,
  getInforClininicOfUserOnPage,
  getClinic,
  fetchAllClinicsOfSupport,
  getTopClinic,
};
