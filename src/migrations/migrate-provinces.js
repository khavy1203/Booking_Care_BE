'use strict';
module.exports = {
    // nameEN: DataTypes.STRING,
    //     nameVI: DataTypes.STRING
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Provinces', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nameEN: {
                type: Sequelize.STRING,
            },
            nameVI: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Provinces');
    }
};