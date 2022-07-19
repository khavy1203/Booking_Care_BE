import clinicApiServices from "../service/clinicApiServices";
import jwt from "jsonwebtoken";
const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await clinicApiServices.getClinicWithPagination(+page, +limit);
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        else {
            let data = await clinicApiServices.getAllClinics();
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (e) {
        console.error("check readFunc: ", e);
        return res.status(500).json({
            EM: "error from sever", //error message
            EC: "-1", //error code
            DT: "",
        });
    }
};
const createFunc = async (req, res) => {
    try {
        //check validate
        let data = await clinicApiServices.createClinic(req.body);
        res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: "error from sever", //error message
            EC: "-1", //error code
            DT: "",
        });
    }
};
const updateFunc = async (req, res) => {
    try {
        let data = await clinicApiServices.updateClinic(req.body);
        res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: "error from sever", //error message
            EC: "-1", //error code
            DT: "",
        });
    }
};
const deleteFunc = async (req, res) => {
    try {
        console.log("check req.body delete func >>>> ", req.body.id);
        let data = await clinicApiServices.deleteClinic(req.body.id);
        res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: "error from sever", //error message
            EC: "-1", //error code
            DT: "",
        });
    }
};


const fetchDoctorOfCLinic = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let idClinic = req.query.id;
            console.log("check page, id ,limit >>", page, limit, idClinic);
            let data = await clinicApiServices.fetchDoctorOfCLinic(+page, +limit, +idClinic);
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        else {
            let data = await clinicApiServices.getAllClinics();
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (e) {
        console.error("check readFunc: ", e);
        return res.status(500).json({
            EM: "error from sever", //error message
            EC: "-1", //error code
            DT: "",
        });
    }
};
const getInforClininicOfUserOnPage = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let province = req.query.province;
            let district = req.query.district;
            let ward = req.query.ward;
            let data = await clinicApiServices.getInforClininicOfUserOnPage(+page, +limit, +province, +district, +ward);
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        else {
            let data = await clinicApiServices.getAllClinics();
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (e) {
        console.error("check readFunc: ", e);
        return res.status(500).json({
            EM: "error from sever", //error message
            EC: "-1", //error code
            DT: "",
        });
    }
};

const getClinic = async (req, res) => {
    try {
        let id = req.query.id;
        console.log("check id >> ", id)
        let data = await clinicApiServices.getClinic(id);
        res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });

    } catch (e) {
        console.error("check readFunc: ", e);
        return res.status(500).json({
            EM: "error from sever", //error message
            EC: "-1", //error code
            DT: "",
        });
    }
};
module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    fetchDoctorOfCLinic,
    getInforClininicOfUserOnPage,
    getClinic
};
