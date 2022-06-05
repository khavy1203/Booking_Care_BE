"use strict";
module.exports = {
  // email: DataTypes.STRING,
  //     password: DataTypes.STRING,
  //     firstName: DataTypes.STRING,
  //     lastName: DataTypes.STRING,
  //     address: DataTypes.STRING,
  //     phone: DataTypes.STRING,
  //     image: DataTypes.BLOB('long'),
  //     genderId: DataTypes.INTEGER
  //    clinicId: DataTypes.INTEGER,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.BLOB("long"),
      },
      genderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("Users");
  },
};
