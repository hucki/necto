import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
const Umzug = require('umzug');

dotenv.config();
const path = require('path');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
import config from '../config/config';

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, '..', './migrations'),
    params: [sequelize.getQueryInterface()],
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
});

(async () => {
  try {
    await umzug.up();
    console.log('✅ migration done');
  } catch (e) {
    console.log('error', e);
    console.log('🚨 migration FAILED');
  }
})();
