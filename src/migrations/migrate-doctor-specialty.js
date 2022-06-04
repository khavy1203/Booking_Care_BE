"use strict";
module.exports = {
  // doctorId: DataTypes.INTEGER,
  //     specialtyId: DataTypes.INTEGER,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Doctor_Specialty", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Doctor_Clinic_Specialty");
  },
};
