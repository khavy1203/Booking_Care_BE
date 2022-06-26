"use strict";
module.exports = {
  // scheduleId: DataTypes.INTEGER,
  //     timeframeId: DataTypes.INTEGER,
  //     currentNumber: DataTypes.INTEGER,
  //     maxNumber: DataTypes.INTEGER,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedule_Detail", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      timeframeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      maxNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
