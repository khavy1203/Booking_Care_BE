import db from '../models/index.js';//connectdb
const getGroups = async () => {
    try {
        let data = await db.Group.findAll({
            order: [['name', 'ASC']]
        });
        return {
            EM: 'get Group successfully',
            EC: 0,
            DT: data
        }
    } catch (e) {
        console.log("check error getGroup >>>", e)
        return {
            EM: 'Something wrong ...',
            EC: '-2',
            DT: ''
        }
    }
}
module.exports = {
    getGroups
}