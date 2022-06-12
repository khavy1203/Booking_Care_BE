"use strict";
module.exports = {
  // image: DataTypes.BLOB('long'),

  // nameVI: DataTypes.STRING,
  // addressVI: DataTypes.STRING,
  // descriptionHTML_VI: DataTypes.TEXT,
  // descriptionMarkdown_VI: DataTypes.TEXT,

  // nameEN: DataTypes.STRING,
  // addressEN: DataTypes.STRING,
  // descriptionHTML_EN: DataTypes.TEXT,
  // descriptionMarkdown_EN: DataTypes.TEXT,

  // provinceId: DataTypes.INTEGER,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Clinics", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.BLOB("long"),
      },

      nameVI: {
        type: Sequelize.STRING,
      },
      addressVI: {
        type: Sequelize.STRING,
      },
      descriptionHTML_VI: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdown_VI: {
        type: Sequelize.TEXT,
      },

      nameEN: {
        type: Sequelize.STRING,
      },
      addressEN: {
        type: Sequelize.STRING,
      },
      descriptionHTML_EN: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdown_EN: {
        type: Sequelize.TEXT,
      },

      provinceId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Clinics");
  },
};
