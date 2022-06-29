"use strict";
module.exports = {
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
        // collate: 'utf32_vietnamese_ci'
      },
      address: {
        type: Sequelize.STRING,
        // collate: 'utf32_vietnamese_ci'
      },
      phone: {
        type: Sequelize.STRING,
      },
      // image: {
      //   type: Sequelize.BLOB("long"),
      // },
      image: {
        type: Sequelize.STRING,
      },
      genderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      githubId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      facebookId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      active: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
