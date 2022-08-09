"use strict";
module.exports = {
  // statusId: DataTypes.INTEGER,
  //     doctorId: DataTypes.INTEGER,
  //     patientId: DataTypes.INTEGER,
  //     scheduleDetailId: DataTypes.INTEGER,
  //     date: DataTypes.STRING
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      scheduleDetailId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
      },
      // timestamp: {
      //   type: Sequelize.STRING,
      // },
      reason: {
        type: Sequelize.TEXT,
      },
      note: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Bookings");
  },
};
