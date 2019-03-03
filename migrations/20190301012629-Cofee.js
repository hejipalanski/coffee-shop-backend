'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Coffees', 'id', {
			allowNull: false,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4
		});
	},

	down: (queryInterface, Sequelize) => {
	}
};
