'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.describeTable('users');
      return;
    } catch (e) {
    }

    const sql = fs.readFileSync(path.resolve(__dirname, './necto.sql'), 'utf8')
      .split(/\r?\n/);

    for (let query of sql) {
      await queryInterface.sequelize.query(query);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events', { cascade: true });
    await queryInterface.dropTable('settings', { cascade: true });
    await queryInterface.dropTable('user_settings', { cascade: true });
    await queryInterface.dropTable('contracts', { cascade: true });
    await queryInterface.dropTable('users', { cascade: true });
  }
};
