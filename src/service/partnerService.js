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
        let findUser = await db.Users.findOne({ where: { email: Clinic.emailUserOfClinicRegister } });
        if (findUser && findUser.groupId !== 3) {
            return {
                EM: "Bạn không được phép đăng ký phòng khám.",
                EC: 1,
                DT: "",
            };
        } else {
            findUser.set({
                phone: Clinic.phoneContact,
            });
        }
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
            if (findUser) {
                findUser.set({
                    clinicId: createClinic.dataValues.id,
                    groupId: 5// cho đối tác có quyền đối tác, nhưng vẫn chưa thể vào phòng khám và hoạt động được tại vì active =0 thì không cho phép (pending)
                });
                await findUser.save();
                return {
                    EM: "Đăng ký thành công. Chúng tôi sẽ liên hệ với bạn.",
                    EC: 0,
                    DT: "",
                };
            }
        }
        return {
            EM: "Có điều gì bị sai sót ở đây !!.",
            EC: 1,
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
                        await db.Doctorinfo.create({
                            doctorId: createNewUser.dataValues.id,
                            active: 2,// 1 hoạt động, 2 là tạm dứng,
                            price: 300000,
                            degree_VI: "Thạc sĩ",
                            degree_EN: "Thạc sĩ"
                        })
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
                include: [{

                    model: db.Specialties,
                    attributes: ["id", "nameVI"],
                    order: [
                        ['id', 'DESC'],
                    ],
                },
                {

                    model: db.Doctorinfo,
                    order: [
                        ['id', 'DESC'],
                    ],
                },
                ],
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

const deleteDoctorOfClinic = async (dataDoctors) => {

    return new Promise(async (resolve, reject) => {
        try {
            console.log("check data Doctor >>", dataDoctors)
            if (dataDoctors['Users.id']) {
                let doctor = await db.Users.findOne({ where: { id: +dataDoctors['Users.id'] } });
                await doctor.destroy();

            }
            if (dataDoctors['Users.Doctorinfo.id']) {
                let doctorInfor = await db.Doctorinfo.findOne({ where: { id: +dataDoctors['Users.Doctorinfo.id'] } })
                await doctorInfor.destroy();

            }
            resolve({
                EM: "Delete successfully",
                EC: "0",
                DT: [],
            });
        } catch (error) {
            reject({

                EM: "Error from to sever",
                EC: -1,
                DT: [],

            });
        }
    });
}

const updateDoctorOfClinic = async (dataDoctors) => {

    return new Promise(async (resolve, reject) => {
        try {
            console.log("check data Doctor >>", dataDoctors)
            let findUser = await db.Users.findOne({ where: { id: dataDoctors.idUser } });
            let finDoctorInfo = await db.Doctorinfo.findOne({ where: { id: dataDoctors.idDoctorInfo } });


            if (findUser) {
                findUser.set({
                    specialtyId: dataDoctors.specialIdUser,
                    username: dataDoctors.username
                });
                await findUser.save();
            }
            if (finDoctorInfo) {
                console.log("check doctorinfo >>>", finDoctorInfo)
                finDoctorInfo.set(
                    dataDoctors);
                let query = await finDoctorInfo.save();
                console.log("check qurery doctorinfo>>", query)
            }
            resolve({
                EM: "Update doctor successfully",
                EC: "0",
                DT: []
            });
        } catch (error) {
            reject({
                EM: "Error from to sever",
                EC: -1,
                DT: [],
            });
        }
    });
}

const addImformationClinic = async (Clinic) => {
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
module.exports = {
    registerClinic,
    registerDoctorClinic,
    getSatusOfClinic,
    getSpecialty,
    getDoctorsOfClinic,
    deleteDoctorOfClinic,
    updateDoctorOfClinic,
    addImformationClinic
};