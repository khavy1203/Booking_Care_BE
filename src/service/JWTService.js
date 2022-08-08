import db from '../models/index.js';//connectdb
const getGroupWithRole = async (user) => {
    console.log("check user groupid :>>>> ", user.groupId)
    let roles = await db.Group.findOne({
        where: { id: user.groupId },
        attributes: ["id", "name", "description"],
        include: {
            model: db.Role,
            attributes: ["id", "url", "description"],
            through: { attributes: [] }//khắc phục lỗi dư maping
        },
    });
    console.log("check roles >>>>: ", roles);
    return roles ? roles : {};
}
module.exports = {
    getGroupWithRole
}