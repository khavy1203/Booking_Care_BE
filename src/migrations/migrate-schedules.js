"use strict";
module.exports = {
  //     date: DataTypes.DATE,
  //     timeId: DataTypes.INTEGER,
  //     doctorId: DataTypes.INTEGER,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      //Huyên đã đổi date sang string
      date: {
        type: Sequelize.STRING,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Schedules");
  },
};
