'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.renameColumn('Shops', 'uuid', 'id');
	},

	down: (queryInterface, Sequelize) => {
	}
};
