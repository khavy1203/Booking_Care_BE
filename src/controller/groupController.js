import groupServices from "../service/groupService";
const readFunc = async (req, res) => {
    try {
        let data = await groupServices.getGroups();
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
module.exports = {
    readFunc
}
