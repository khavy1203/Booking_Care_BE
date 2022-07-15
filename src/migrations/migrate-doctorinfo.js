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
        type: Sequelize.STRING,
      },
      descriptionHTLM_VI: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdown_VI: {
        type: Sequelize.TEXT,
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
        type: Sequelize.STRING,
      },
      descriptionHTLM_EN: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdown_EN: {
        type: Sequelize.TEXT,
      },
      degree_EN: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      active: {
        type: Sequelize.INTEGER,
      },
      linkfile: {
        type: Sequelize.STRING,
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
