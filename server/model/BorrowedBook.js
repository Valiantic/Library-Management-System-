import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const BorrowedBook = sequelize.define(
  'BorrowedBook',
  {
    borrowedId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    bookId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },

    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    dateAndTimeAdded: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    status: {
      type: DataTypes.ENUM('borrowed', 'returned'),
      allowNull: false,
      defaultValue: 'borrowed',
    },
  },
  {
    tableName: 'borrowed_books',
    timestamps: false,
  }
);

BorrowedBook.associate = (models) => {
  BorrowedBook.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  BorrowedBook.belongsTo(models.Books, {
    foreignKey: 'bookId',
    as: 'book',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default BorrowedBook;
