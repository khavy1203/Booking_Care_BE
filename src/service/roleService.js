import db from '../models/index.js';

const createNewRole = async (roles) => {
    try {
        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true
        })//lất tất cả các roles ra
        const persists = roles.filter(({ url: url1 }) =>
            !currentRoles.some(({ url: url2 }) => url1 === url2)
        )//hàm trên mục đích là lọc tất cả phần tử
        //hàm some sẽ kiểm tra chỉ cần 1 giá trị thuộc điều kiện đúng thì hàm sẽ trả về là true
        //hàm sẽ dừng
        // kiểm tra nếu mảng có url1 trùng với bất vì url2 nào thì hàm some sẽ trả về true, phủ định của true là false
        //đồng tời filter(lưu dưới dạng 1 mảng) sẽ lấy tất cả các giá trị thõa mãn điều kiện
        //lưu các giá trị trả về là true, và không lưu các giá trị trả về là false

        if (persists.length === 0) {
            return {
                EM: 'Nothing to create...',
                EC: 0,
                DT: []
            }
        }
        await db.Role.bulkCreate(persists);
        return {
            EM: `Create roles succeeds: ${persists.length} roles...`,
            EC: 0,
            DT: []
        }
    } catch (e) {
        console.log("check error creatnewrole >>>", e)
        return {
            EM: 'Something wrong ...',
            EC: '-2',
            DT: ''
        }

    }
}
const getAllRoles = async () => {
    try {
        let data = await db.Role.findAll({
            order: [['id', 'DESC']],
            raw: true
        })
        return {
            EM: 'get all succeeds',
            EC: 0,
            DT: data
        }
    } catch (e) {
        console.log("check error getAllRoles >>>", e)
        return {
            EM: 'Something wrong ...',
            EC: '-2',
            DT: ''
        }
    }
}
const deleteRole = async (id) => {
    try {
        let role = await db.Role.findOne({
            where: { id: id }
        })
        if (role) {
            await role.destroy();
        }
        return {
            EM: 'delete role succeed',
            EC: 0,
            DT: []
        }
    } catch (e) {
        console.log("check error getAllRoles >>>", e)
        return {
            EM: 'Something wrong ...',
            EC: '-2',
            DT: ''
        }
    }
}
const getRoleByGroup = async (id) => {
    try {

        if (!id) {
            return {
                EM: `Not found any roles`,
                EC: 0,
                data: []
            }
        }
        let roles = await db.Group.findOne({
            where: { id: id },
            attributes: ["id", "name", "description"],
            include: {
                model: db.Role,
                attributes: ["id", "url", "description"],
                through: { attributes: [] }
            },

        })
        return {
            EM: 'get role by group succeed',
            EC: 0,
            DT: roles
        }
    } catch (e) {
        console.log("check error getAllRoles >>>", e)
        return {
            EM: 'Something wrong ...',
            EC: '-2',
            DT: ''
        }
    }
}
const assignRoleToGroup = async (data) => {
    try {

        await db.Group_Role.destroy({
            where: { groupId: +data.groupId }
        })
        await db.Group_Role.bulkCreate(data.groupRoles);
        return {
            EM: 'create successfully',
            EC: 0,
            DT: []
        }
    } catch (e) {
        console.log("check error getAllRoles >>>", e)
        return {
            EM: 'Something wrong ...',
            EC: '-2',
            DT: ''
        }
    }
}
module.exports = {
    createNewRole,
    getAllRoles,
    deleteRole,
    getRoleByGroup,
    assignRoleToGroup
}