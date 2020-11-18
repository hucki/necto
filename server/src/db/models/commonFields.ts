import { DataTypes } from 'sequelize'

export const commonFieldsWithoutValidity = {
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
      isDate: true,
    },
  },
}

export const commonFields = {
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    secondaryKey: true,
    validate: {
      isDate: true,
    },
  },
  ...commonFieldsWithoutValidity,
}
