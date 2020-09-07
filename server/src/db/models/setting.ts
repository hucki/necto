module.exports = (sequelize, DataTypes) => {
  const setting = sequelize.define('setting', {
    cal_days: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  cal_hours_start: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cal_hours_end: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timescale_width: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

  });

  return setting;
};
