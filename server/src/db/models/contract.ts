module.exports = (sequelize, DataTypes) => {
  const contract = sequelize.define('contract', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    hours_per_week: {
      type: DataTypes.INTEGER
    },
    appointments_per_week: {
      type: DataTypes.INTEGER
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false,
      secondaryKey: true,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },


  });

  return contract;
};
