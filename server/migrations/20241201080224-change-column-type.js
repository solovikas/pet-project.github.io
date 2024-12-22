'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('genres', 'name', 'genre_name');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('genres', 'genre_name', 'name');
  }
};
