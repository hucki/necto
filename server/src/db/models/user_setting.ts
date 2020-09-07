module.exports = (sequelize, DataTypes) => {
  const user_setting = sequelize.define('user_setting', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    bg_color: {
      type: DataTypes.STRING
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
  });

  return user_setting;
};
