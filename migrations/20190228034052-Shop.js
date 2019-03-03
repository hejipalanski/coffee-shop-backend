'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Shops', 'id', {
				autoIncrement: false,
				type: Sequelize.UUID
			});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Shops', 'id', {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			});
	}
};
