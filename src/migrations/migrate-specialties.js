"use strict";
module.exports = {
  // image: DataTypes.BLOB('long'),
  //   nameVI: DataTypes.STRING,
  //   descriptionHTML_VI: DataTypes.TEXT,
  //   descriptionMarkdown_VI: DataTypes.TEXT,
  //   nameEN: DataTypes.STRING,
  //   descriptionHTML_EN: DataTypes.TEXT,
  //   descriptionMarkdown_EN: DataTypes.TEXT,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Specialties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
      },
      nameVI: {
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
      descriptionHTML_EN: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdown_EN: {
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Specialties");
  },
};
