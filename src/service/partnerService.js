import db from "../models/index.js"; //connectdb
import loginRegisterService from "./loginRegisterService.js";
import { sendEmailPassword } from "./emailService";
import { isBuffer } from "lodash";
const makeid = length => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const registerClinic = async (Clinic) => {
    try {
        // Clinic.status = 2; // status 1 là xác nhận hoạt động, 2 là pending
        console.log("check clinic >>>", Clinic);
        let createClinic = await db.Clinics.create({
            nameVI: Clinic.name,
            addressVI: Clinic.address,
            provinceId: Clinic.province,
            districtId: Clinic.district,
            wardId: Clinic.ward,
            linkfile: Clinic.url,
            phoneContact: Clinic.phoneContact,
            status: 0//trạng thái pending
        })
        console.log("check createClinic >>>", createClinic.dataValues.id);
        if (createClinic.dataValues.id) {
            let findUser = await db.Users.findOne({ where: { email: Clinic.emailUserOfClinicRegister } });
            if (findUser) {
                findUser.set({
                    clinicId: createClinic.dataValues.id,
                    groupId: 5// cho đối tác có quyền đối tác, nhưng vẫn chưa thể vào phòng khám và hoạt động được tại vì active =0 thì không cho phép (pending)
                });
                await findUser.save();
            }
        }
        return {
            EM: "Đăng ký thành công. Chúng tôi sẽ liên hệ với bạn.",
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
const registerDoctorClinic = async (dataDoctors) => {

    return new Promise(async (resolve, reject) => {
        try {
            let emailexist = [];
            await Promise.all(Object.entries(dataDoctors).map(async ([key, child], index) => {
                let findEmail = await db.Users.findOne({ where: { email: child.doctorEmail } });

                if (findEmail && findEmail.dataValues) {

                    emailexist.push(child.doctorEmail);
                    console.log("check emailexist ", emailexist)
                } else {
                    let password = makeid(6);
                    let hashPassword = loginRegisterService.hashUserPassword(password);
                    let createNewUser = await db.Users.create({//đăng ký doctor
                        email: child.doctorEmail,
                        address: child.description ? +child.description : "",
                        password: hashPassword,
                        groupId: 2,
                        clinicId: +child.clinicId,//đã lấy được phòng khám mà người chủ sỡ hữu quản lý
                        specialtyId: +child.idSpecialty
                    });// tạo user
                    if (createNewUser) {
                        let objEmail = {
                            email: child.doctorEmail,
                            password: password
                        }
                        await sendEmailPassword(objEmail);
                    }

                }
            }))
            console.log("check email exist >>>", emailexist)

            if (emailexist[0]
                !== undefined) {
                resolve({
                    EM: "Các email không tạo được vì đã tồn tại trên hệ thống",
                    EC: 1,
                    DT: emailexist,
                });
            } else {
                resolve({
                    EM: "Tạo email thành công",
                    EC: 0,
                    DT: [],
                });
            }

        } catch (error) {
            reject(error);
        }
    });
}
const getSatusOfClinic = async (id) => {
    try {
        console.log("check id")
        let clinic = await db.Clinics.findOne({
            where: {
                id: id
            },
            raw: true
        })
        console.log("check clinic >>>", clinic)
        if (clinic) {
            return {
                EM: "get status clinic success",
                EC: 0,
                DT: clinic.status,// trả về trạng thái của phòng khám đó
            };
        }

    } catch (e) {
        console.log("error from service : >>>", e);
        return {
            EM: "Something wrong ...",
            EC: -2,
            DT: "",
        };
    }
};

const getSpecialty = async () => {
    try {
        let specialty = await db.Specialties.findAll();

        if (specialty) {
            return {
                EM: "get data successfully",
                EC: "0",
                DT: specialty,
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
const getDoctorsOfClinic = async (id) => {
    try {
        let clinicContainerDoctor = await db.Clinics.findAll({
            where: { id: id },

            include: [{
                model: db.Users,
                attributes: { exclude: ['password', 'googleId', 'githubId', 'facebookId'] },
                include: {
                    model: db.Specialties,
                    attributes: ["id", "nameVI"],

                },

            }],
            raw: true
        });

        console.log("check data >>", clinicContainerDoctor)
        if (clinicContainerDoctor) {
            return {
                EM: "get data successfully",
                EC: "0",
                DT: clinicContainerDoctor,
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
module.exports = {
    registerClinic,
    registerDoctorClinic,
    getSatusOfClinic,
    getSpecialty,
    getDoctorsOfClinic
};