import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Users = sequelize.define(
  'Users',
  {
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM('student', 'admin', 'superadmin'),
      allowNull: false,
    },

    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    verifiedUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    verificationCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    codeExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    loginSessionToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    passwordResetSessionToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

export default Users;
