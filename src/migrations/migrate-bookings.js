"use strict";
module.exports = {
  // statusId: DataTypes.INTEGER,
  //     doctorId: DataTypes.INTEGER,
  //     patientId: DataTypes.INTEGER,
  //     schedule_detail_id: DataTypes.INTEGER,
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
      schedule_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date: {
        type: Sequelize.STRING,
        // type: Sequelize.DATE,
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
