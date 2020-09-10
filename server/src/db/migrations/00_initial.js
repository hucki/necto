const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = {
  up: async (query) => {
    try {
      await query.describeTable('users');
      return;
    } catch (e) {}
    const sql = fs
      .readFileSync(path.resolve(__dirname, './necto.sql'), 'utf8')
      .split(/\r?\n/);

    for (let sqlStatement of sql) {
      await query.sequelize.query(sqlStatement);
    }
  },
  down: async (query) => {
    await query.dropTable('events', { cascade: true });
    await query.dropTable('settings', { cascade: true });
    await query.dropTable('userSettings', { cascade: true });
    await query.dropTable('contracts', { cascade: true });
    await query.dropTable('users', { cascade: true });
  },
};
