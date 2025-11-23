'use strict';
const { Model } = require('sequelize');
const { encrypt, decrypt } = require("../utils/crypto");

module.exports = (sequelize, DataTypes) => {
  class StoreSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StoreSettings.init({
    shopDomain: DataTypes.STRING,
    mindlabUserEmail: DataTypes.STRING,
    mindlabAuthToken: {
      type: DataTypes.TEXT,
      set(value) {
        if (!value) {
          this.setDataValue("mindlabAuthToken", null);
        } else {
          this.setDataValue("mindlabAuthToken", encrypt(value));
        }
      },
      get() {
        const encrypted = this.getDataValue("mindlabAuthToken");
        return encrypted ? decrypt(encrypted) : null;
      }
    },
    mindlabCompanyId: DataTypes.INTEGER,
    selectedAgentId: DataTypes.INTEGER,
    agentToken: {
      type: DataTypes.TEXT,
      set(value) {
        if (!value) {
          this.setDataValue("agentToken", null);
        } else {
          this.setDataValue("agentToken", encrypt(value));
        }
      },
      get() {
        const encrypted = this.getDataValue("agentToken");
        return encrypted ? decrypt(encrypted) : null;
      },
    },
    widgetActive: DataTypes.BOOLEAN,
    scriptTagId: DataTypes.STRING,
    widgetPosition: DataTypes.ENUM("top-left", "top-right", "bottom-left", "bottom-right"),
    primaryColor: DataTypes.STRING,
    language: DataTypes.STRING,
    connectedAt: DataTypes.DATE,
    lastSync: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'StoreSettings',
    tableName: 'StoreSettings'
  });
  return StoreSettings;
};