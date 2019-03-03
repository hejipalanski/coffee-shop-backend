'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('Shops', 'id', {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4
		});
	},

	down: (queryInterface, Sequelize) => {
	}
};
