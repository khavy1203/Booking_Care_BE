'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('User', [
      {
        userEmail: 'kv@gmail.com',
        userName: 'kv',
        userPassword: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userEmail: 'kv1@gmail.com',
        userName: 'kv1',
        userPassword: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userEmail: 'kv2@gmail.com',
        userName: 'kv2',
        userPassword: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
