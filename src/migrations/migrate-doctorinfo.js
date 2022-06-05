"use strict";
module.exports = {
  // introductionVI: DataTypes.STRING,
  //   noteVI: DataTypes.STRING,
  //   paymentVI: DataTypes.STRING,
  //   descriptionHTLM_VI: DataTypes.TEXT,
  //   descriptionMarkdown_VI: DataTypes.TEXT,
  //   introductionEN: DataTypes.STRING,
  //   noteEN: DataTypes.STRING,
  //   paymentEN: DataTypes.STRING,
  //   descriptionHTLM_EN: DataTypes.TEXT,
  //   descriptionMarkdown_EN: DataTypes.TEXT,
  //   price: DataTypes.STRING,
  //   doctorId: DataTypes.INTEGER,
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
