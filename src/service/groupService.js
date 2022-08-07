import db from '../models/index.js';//connectdb
const { Op } = require("sequelize");

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

let createGroup = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.description) {
                resolve({
                    EM: "Missing parameter",
                    EC: 1,
                    ED: "",
                });
            } else {
                let findGroup = await db.Group.findOne({
                    where: {
                        [Op.or]: [
                            {
                                name:
                                {
                                    [Op.like]: '%' + data.name + '%'
                                }
                            },

                        ]
                    }
                    , raw: true
                })
                if (findGroup) {
                    resolve({
                        EC: 1,
                        EM: "Tồn tại group",
                    });

                } else {
                    await db.Group.create(data)
                    resolve({
                        EC: 0,
                        EM: "create group succeeds!!!",
                    });
                }

            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    getGroups,
    createGroup
}