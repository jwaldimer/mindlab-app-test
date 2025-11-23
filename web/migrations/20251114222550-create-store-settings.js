'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StoreSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shopDomain: {
        type: Sequelize.STRING
      },
      mindlabUserEmail: {
        type: Sequelize.STRING
      },
      mindlabAuthToken: {
        type: Sequelize.TEXT
      },
      mindlabCompanyId: {
        type: Sequelize.INTEGER
      },
      selectedAgentId: {
        type: Sequelize.INTEGER
      },
      agentToken: {
        type: Sequelize.TEXT
      },
      widgetActive: {
        type: Sequelize.BOOLEAN
      },
      scriptTagId: {
        type: Sequelize.INTEGER
      },
      widgetPosition: {
        type: Sequelize.ENUM("top-left", "top-right", "bottom-left", "bottom-right"),
        defaultValue: "bottom-right"
      },
      primaryColor: {
        type: Sequelize.STRING
      },
      language: {
        type: Sequelize.STRING
      },
      connectedAt: {
        type: Sequelize.DATE
      },
      lastSync: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StoreSettings');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_StoreSettings_widgetPosition";');
  }
};