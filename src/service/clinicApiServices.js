import db from "../models/index.js"; //connectdb
import {
    checkEmail,
    checkPhone,
    hashClinicPassword,
} from "./loginRegisterService.js";

const getClinicWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Clinics.findAndCountAll({
            offset: offset,
            limit: limit,
            include: {
                model: db.Provinces,
                attributes: ["id", "nameEN", "nameVI"],
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
        let clinics = await db.Clinics.findAll({
            include: {
                model: db.Provinces,
                attributes: ["id", "nameEN", "nameVI"],
            },
        });

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
        await db.Clinics.create(Clinic);
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
        console.log("check clinic >>>", Clinic)

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

module.exports = {
    getAllClinics,
    createClinic,
    updateClinic,
    deleteClinic,
    getClinicWithPagination,
};
