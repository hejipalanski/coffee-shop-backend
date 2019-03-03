'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Shops', 'uuid', {
				type: Sequelize.UUID,
				allowNull: false,
				autoIncrement: false
		});
	},

	down: (queryInterface, Sequelize) => {
	}
};
