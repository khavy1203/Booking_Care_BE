"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Doctorinfo", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      introductionVI: {
        type: Sequelize.STRING,
      },
      noteVI: {
        type: Sequelize.STRING,
      },
      paymentVI: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      descriptionHTLM_VI: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      descriptionMarkdown_VI: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      degree_VI: {
        type: Sequelize.STRING,
      },

      introductionEN: {
        type: Sequelize.STRING,
      },
      noteEN: {
        type: Sequelize.STRING,
      },
      paymentEN: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      descriptionHTLM_EN: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      descriptionMarkdown_EN: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      degree_EN: {
        type: Sequelize.STRING,
      },

      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("Doctorinfo");
  },
};
