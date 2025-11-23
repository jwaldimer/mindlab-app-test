'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('StoreSettings', 'scriptTagId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('StoreSettings', 'scriptTagId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
