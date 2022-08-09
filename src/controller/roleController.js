import userApiServices from "../service/userAPIServices";
import roleApiServices from "../service/roleService";
const readFunc = async (req, res) => {
    try {

        let data = await roleApiServices.getAllRoles();
        console.log("check list role >>. in redFunc role", data);
        res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });


    } catch (e) {
        console.error("check readFunc: ", e);
        return res.status(500).json({
            EM: 'error from sever',//error message
            EC: '-1',//error code
            DT: ''
        })
    }
}
const createFunc = async (req, res) => {
    try {
        //check validate
        let data = await roleApiServices.createNewRole(req.body);
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
const updateFunc = async (req, res) => {
    try {
        let data = await userApiServices.updateUser(req.body);
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
const deleteFunc = async (req, res) => {
    try {
        console.log("check req.body delete func >>>> ", req.body.id)
        let data = await roleApiServices.deleteRole(req.body.id);
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
const getUserAccount = async (req, res) => {
    return res.status(200).json({
        EM: 'ok',//error
        EC: 0,
        DT: {
            access_token: req.token,
            groupWithRoles: req.user.groupWithRoles,
            email: req.user.userEmail,
            username: req.user.userName
        }
    })
}
const getRoleByGroup = async (req, res) => {
    try {
        let id = req.params.groupId;
        let data = await roleApiServices.getRoleByGroup(id);
        return res.status(200).json({
            EM: data.EM,//error
            EC: data.EC,
            DT: data.DT
        })
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: 'error from sever',//error message
            EC: '-1',//error code
            DT: ''
        })
    }
}
const assignRoleToGroup = async (req, res) => {
    try {
        let data = await roleApiServices.assignRoleToGroup(req.body.data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (e) {
        console.error("check error: ", e);
        return res.status(500).json({
            EM: 'error from sever',//error message
            EC: '-1',//error code
            DT: ''
        })
    }

}
module.exports = {
    readFunc, createFunc, updateFunc, deleteFunc, getUserAccount, getRoleByGroup, assignRoleToGroup
}