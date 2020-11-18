import {DataTypes} from 'sequelize'
export const commonFields = {
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    secondaryKey: true,
    validate: {
      isDate: true,
    },
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
