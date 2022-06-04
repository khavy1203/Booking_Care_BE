import userApiServices from "../service/userAPIServices";
const readFunc = async (req, res) => {
    try {


        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await userApiServices.getUserWithPagination(+page, +limit);
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        else {
            let data = await userApiServices.getAllUsers();
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }

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
        let data = await userApiServices.createUser(req.body);
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
        let data = await userApiServices.deleteUser(req.body.id);
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
module.exports = {
    readFunc, createFunc, updateFunc, deleteFunc, getUserAccount

}