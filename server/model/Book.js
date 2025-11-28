import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Books = sequelize.define(
  'Books',
  {
    bookId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    language: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'books',
    timestamps: true,
  }
);

export default Books;
