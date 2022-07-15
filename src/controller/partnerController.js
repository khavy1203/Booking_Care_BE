
import partnerApiServices from "../service/partnerService";
const registerClinicFunc = async (req, res) => {
    try {
        //check validate
        let data = await partnerApiServices.registerClinic(req.body);
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
const registerDoctorClinic = async (req, res) => {
    try {
        //check validate
        let data = await partnerApiServices.registerDoctorClinic(req.body);
        res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: 'error from sever',//error message
            EC: '-1',//error code
            DT: ''
        })
    }
}


const getStatusClinic = async (req, res) => {
    try {
        if (req.query.id) {
            let data = await partnerApiServices.getSatusOfClinic(+req.query.id);
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: 'error from sever',//error message
            EC: '-1',//error code
            DT: ''
        })
    }
}
const getSpecialty = async (req, res) => {
    try {

        let data = await partnerApiServices.getSpecialty();
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

const getDoctorsOfClinic = async (req, res) => {
    try {
        if (req.query.id) {
            let data = await partnerApiServices.getDoctorsOfClinic(+req.query.id);
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: 'error from sever',//error message
            EC: '-1',//error code
            DT: ''
        })
    }
};

const deleteDoctorOfClinic = async (req, res) => {
    try {
        let data = await partnerApiServices.deleteDoctorOfClinic(req.body);
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
const updateDoctorOfClinic = async (req, res) => {
    try {
        let data = await partnerApiServices.updateDoctorOfClinic(req.body);
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
module.exports = {
    registerClinicFunc,
    registerDoctorClinic,
    getStatusClinic,
    getSpecialty,
    getDoctorsOfClinic,
    deleteDoctorOfClinic,
    updateDoctorOfClinic
}