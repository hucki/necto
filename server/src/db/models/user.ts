module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true,
      },
    },
  });

  user.associate = (model) => {
    user.hasMany(model.event , {foreignKey: "user_id"});
    user.hasOne(model.user_setting, {foreignKey: "user_id"});
    user.hasOne(model.contract, {foreignKey: "user_id"});
  };

  return user;
};
