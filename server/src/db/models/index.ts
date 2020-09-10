const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
import config from '../config/config';
import { User, userFields } from './User';
import { Event, eventFields } from './Event';

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

const db = {
  sequelize,
  Sequelize,
};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

User.init(userFields, {
  tableName: 'users',
  sequelize,
});
Event.init(eventFields, {
  tableName: 'events',
  sequelize,
});
User.hasMany(Event, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'events',
});
module.exports = db;
